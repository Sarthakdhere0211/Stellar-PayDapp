export const NETWORK_CONFIG = {
    testnet: {
        networkPassphrase: 'Test SDF Network ; September 2015',
        horizonUrl: 'https://horizon-testnet.stellar.org',
        name: 'Testnet',
    },
    public: {
        networkPassphrase: 'Public Global Stellar Network ; September 2015',
        horizonUrl: 'https://horizon.stellar.org',
        name: 'Public Network',
    },
} as const;

export const CURRENT_NETWORK = NETWORK_CONFIG.testnet;

export const TX_CONFIG = {
    timeout: 180,
    baseFee: '100',
} as const;

export const UI_MESSAGES = {
    walletNotInstalled: 'Freighter wallet is not installed. Please install it from https://www.freighter.app/',
    connectionFailed: 'Failed to connect to Freighter wallet',
    transactionSuccess: 'Transaction submitted successfully!',
    transactionFailed: 'Transaction failed. Please try again.',
    insufficientBalance: 'Insufficient XLM balance',
    invalidAddress: 'Invalid Stellar address',
} as const;

export const NATIVE_ASSET = 'XLM';

export const STELLAR_EXPERT_URL = 'https://stellar.expert/explorer/testnet';
