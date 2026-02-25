import type { Transaction } from '@stellar/stellar-sdk';
import { CURRENT_NETWORK } from './constants';

let stellarSdkPromise: Promise<typeof import('@stellar/stellar-sdk')> | null = null;
let freighterApiPromise: Promise<typeof import('@stellar/freighter-api')> | null = null;
let serverInstance: InstanceType<(typeof import('@stellar/stellar-sdk'))['Horizon']['Server']> | null = null;

const loadStellarSdk = async () => {
    if (!stellarSdkPromise) {
        stellarSdkPromise = import('@stellar/stellar-sdk');
    }
    return stellarSdkPromise;
};

const loadFreighterApi = async () => {
    if (!freighterApiPromise) {
        freighterApiPromise = import('@stellar/freighter-api');
    }
    return freighterApiPromise;
};

const getServer = async () => {
    if (!serverInstance) {
        const { Horizon } = await loadStellarSdk();
        serverInstance = new Horizon.Server(CURRENT_NETWORK.horizonUrl);
    }
    return serverInstance;
};

export async function isFreighterInstalled(): Promise<boolean> {
    try {
        const freighterApi = await loadFreighterApi();
        const result = await freighterApi.isConnected();
        return result.isConnected;
    } catch {
        return false;
    }
}

export function shortenAddress(address: string, chars = 4): string {
    if (!address) return '';
    return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
}

export function formatXLM(value: string | number): string {
    const amount = typeof value === 'number' ? value : parseFloat(value);
    if (Number.isNaN(amount)) return '0';
    return amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 7,
    });
}

export async function fetchBalance(publicKey: string): Promise<string> {
    try {
        const server = await getServer();
        const account = await server.loadAccount(publicKey);
        const nativeBalance = account.balances.find(
            (balance) => balance.asset_type === 'native'
        );
        return nativeBalance ? nativeBalance.balance : '0';
    } catch (error: unknown) {
        if (typeof error === 'object' && error !== null && 'response' in error) {
            const resp = (error as { response: { status: number } }).response;
            if (resp.status === 404) return '0';
        }
        throw error;
    }
}

export async function getAccountBalance(publicKey: string): Promise<string> {
    return fetchBalance(publicKey);
}

export function isValidStellarAddress(address: string): boolean {
    return /^G[A-Z2-7]{55}$/.test(address);
}

export function isValidAddress(address: string): boolean {
    return isValidStellarAddress(address);
}

export async function sendPayment(
    sourcePublicKey: string,
    destinationAddress: string,
    amount: string,
    memo?: string
): Promise<{ hash: string }> {
    const { TransactionBuilder, Operation, Asset, Memo, BASE_FEE } = await loadStellarSdk();
    const server = await getServer();

    const sourceAccount = await server.loadAccount(sourcePublicKey);

    let destinationExists = true;
    try {
        await server.loadAccount(destinationAddress);
    } catch (error: unknown) {
        if (typeof error === 'object' && error !== null && 'response' in error) {
            const resp = (error as { response: { status: number } }).response;
            if (resp.status === 404) {
                destinationExists = false;
            } else {
                throw error;
            }
        } else {
            throw error;
        }
    }

    let txBuilder = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: CURRENT_NETWORK.networkPassphrase,
    });

    if (memo) {
        txBuilder = txBuilder.addMemo(Memo.text(memo));
    }

    let transaction: Transaction;

    if (destinationExists) {
        transaction = txBuilder
            .addOperation(
                Operation.payment({
                    destination: destinationAddress,
                    asset: Asset.native(),
                    amount: amount,
                })
            )
            .setTimeout(180)
            .build();
    } else {
        transaction = txBuilder
            .addOperation(
                Operation.createAccount({
                    destination: destinationAddress,
                    startingBalance: amount,
                })
            )
            .setTimeout(180)
            .build();
    }

    let signedXDR: string;

    try {
        const freighterApi = await loadFreighterApi();
        const signResult = await freighterApi.signTransaction(
            transaction.toXDR(),
            {
                networkPassphrase: CURRENT_NETWORK.networkPassphrase,
            }
        );

        if (signResult.error) {
            throw new Error(signResult.error || 'Transaction signing failed');
        }

        if (!signResult.signedTxXdr) {
            throw new Error('No signed transaction returned from Freighter');
        }

        signedXDR = signResult.signedTxXdr;
    } catch (err) {
        if (err instanceof Error) {
            if (err.message.includes('User declined') || err.message.includes('rejected')) {
                throw new Error('Transaction was rejected by user');
            }
            throw err;
        }
        throw new Error('Failed to sign transaction');
    }

    const signedTransaction = TransactionBuilder.fromXDR(
        signedXDR,
        CURRENT_NETWORK.networkPassphrase
    ) as Transaction;

    const result = await server.submitTransaction(signedTransaction);

    return { hash: result.hash };
}
