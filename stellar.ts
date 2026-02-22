import {
    Horizon,
    StrKey,
    TransactionBuilder,
    Operation,
    Asset,
    Memo,
    Transaction,
    BASE_FEE,
} from '@stellar/stellar-sdk';

import * as freighterApi from '@stellar/freighter-api';
import { CURRENT_NETWORK } from './constants';

/**
 * Checks if the Freighter wallet extension is installed in the browser
 */
export async function isFreighterInstalled(): Promise<boolean> {
    const result = await freighterApi.isConnected();
    return result.isConnected;
}

/**
 * Requests the public key from the Freighter wallet
 */
export async function connectWallet(): Promise<string> {
    const connected = await isFreighterInstalled();
    if (!connected) {
        throw new Error('Freighter wallet not installed');
    }

    const result = await freighterApi.requestAccess();

    if (result.error) {
        throw new Error(result.error || 'Failed to connect wallet');
    }

    if (result.address) {
        return result.address;
    }

    throw new Error('Failed to retrieve public key');
}

/**
 * Wrapper for fetchBalance to match usage in hooks
 */
export async function getAccountBalance(publicKey: string): Promise<string> {
    return fetchBalance(publicKey);
}

/**
 * Shortens a Stellar public key for display purposes
 */
export function shortenAddress(address: string, chars = 4): string {
    if (!address) return '';
    return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
}


// Initialize the Horizon server for TESTNET
const server = new Horizon.Server(CURRENT_NETWORK.horizonUrl);

/**
 * Fetches the XLM balance for a given Stellar account
 * 
 * @param publicKey - The Stellar public key (address) to check
 * @returns The XLM balance as a string, or "0" if account doesn't exist
 */
export async function fetchBalance(publicKey: string): Promise<string> {
    try {
        // Load the account from the Horizon server
        const account = await server.loadAccount(publicKey);

        // Find the native XLM balance from the account's balances array
        // Native assets have asset_type of 'native'
        const nativeBalance = account.balances.find(
            (balance) => balance.asset_type === 'native'
        );

        return nativeBalance ? nativeBalance.balance : '0';
    } catch (error: unknown) {
        // If the account doesn't exist on the network yet, return 0
        if (error instanceof Error && 'response' in error && (error as any).response?.status === 404) {
            return '0';
        }
        throw error;
    }
}

/**
 * Validates if a string is a valid Stellar public key
 * 
 * @param address - The address to validate
 * @returns true if valid, false otherwise
 */
export function isValidStellarAddress(address: string): boolean {
    try {
        StrKey.decodeEd25519PublicKey(address);
        return true;
    } catch {
        return false;
    }
}

/**
 * Alias for isValidStellarAddress to match usage in components
 */
export function isValidAddress(address: string): boolean {
    return isValidStellarAddress(address);
}

/**
 * Formats XLM balance for display
 * 
 * @param balance - The balance string to format
 * @returns Formatted balance with proper decimal places
 */
export function formatXLM(balance: string): string {
    const num = parseFloat(balance);
    if (isNaN(num)) return '0.00';

    // Format with up to 7 decimal places (Stellar precision)
    // but remove trailing zeros
    return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 7,
    });
}

export async function sendPayment(
    sourcePublicKey: string,
    destinationAddress: string,
    amount: string,
    memo?: string
): Promise<{ hash: string }> {
    console.log('=== Starting Payment ===');
    console.log('From:', sourcePublicKey);
    console.log('To:', destinationAddress);
    console.log('Amount:', amount);

    // Step 1: Load the source account to get sequence number
    const sourceAccount = await server.loadAccount(sourcePublicKey);
    console.log('Source account loaded');

    // Step 2: Check if destination account exists
    let destinationExists = true;
    try {
        await server.loadAccount(destinationAddress);
        console.log('Destination account exists');
    } catch (error: unknown) {
        if (error instanceof Error && 'response' in error && (error as any).response?.status === 404) {
            destinationExists = false;
            console.log('Destination account does not exist - will use createAccount');
        } else {
            throw error;
        }
    }

    // Step 3: Build the transaction
    // We use TransactionBuilder to construct the transaction with proper formatting
    let txBuilder = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE, // Base fee for the transaction (100 stroops)
        networkPassphrase: CURRENT_NETWORK.networkPassphrase,
    });

    if (memo) {
        txBuilder = txBuilder.addMemo(Memo.text(memo));
    }

    let transaction: Transaction;

    if (destinationExists) {
        // If destination exists, use a regular payment operation
        transaction = txBuilder
            .addOperation(
                Operation.payment({
                    destination: destinationAddress,
                    asset: Asset.native(), // XLM (native asset)
                    amount: amount,
                })
            )
            .setTimeout(180) // Transaction valid for 3 minutes
            .build();
    } else {
        // If destination doesn't exist, use createAccount operation
        // This creates and funds the account in one operation
        // Minimum balance on Stellar is 1 XLM for a new account
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

    console.log('Transaction built, XDR:', transaction.toXDR().substring(0, 50) + '...');

    // Step 4: Sign the transaction using Freighter wallet
    // This will prompt the user in the Freighter extension to approve
    console.log('Requesting signature from Freighter...');

    let signedXDR: string;

    try {
        const signResult = await freighterApi.signTransaction(
            transaction.toXDR(),
            {
                networkPassphrase: CURRENT_NETWORK.networkPassphrase,
            }
        );

        console.log('Sign result:', signResult);

        // Check for error in response
        if (signResult.error) {
            throw new Error(signResult.error || 'Transaction signing failed');
        }

        if (!signResult.signedTxXdr) {
            throw new Error('No signed transaction returned from Freighter');
        }

        signedXDR = signResult.signedTxXdr;
    } catch (err) {
        console.error('Signing error:', err);
        if (err instanceof Error) {
            if (err.message.includes('User declined') || err.message.includes('rejected')) {
                throw new Error('Transaction was rejected by user');
            }
            throw err;
        }
        throw new Error('Failed to sign transaction');
    }

    console.log('Transaction signed successfully');

    // Step 5: Parse the signed transaction and submit to the network
    const signedTransaction = TransactionBuilder.fromXDR(
        signedXDR,
        CURRENT_NETWORK.networkPassphrase
    ) as Transaction;

    console.log('Submitting transaction to network...');
    const result = await server.submitTransaction(signedTransaction);
    console.log('Transaction submitted! Hash:', result.hash);

    return { hash: result.hash };
}