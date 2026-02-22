/**
 * Stellar Network Configuration
 * Uses Testnet for development and testing
 */

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

// Default to Testnet for safety
export const CURRENT_NETWORK = NETWORK_CONFIG.testnet;

// Transaction configuration
export const TX_CONFIG = {
    timeout: 180, // Transaction timeout in seconds
    baseFee: '100', // Base fee in stroops (0.00001 XLM)
} as const;

// UI Constants
export const UI_MESSAGES = {
    walletNotInstalled: 'Freighter wallet is not installed. Please install it from https://www.freighter.app/',
    connectionFailed: 'Failed to connect to Freighter wallet',
    transactionSuccess: 'Transaction submitted successfully!',
    transactionFailed: 'Transaction failed. Please try again.',
    insufficientBalance: 'Insufficient XLM balance',
    invalidAddress: 'Invalid Stellar address',
} as const;

// Stellar Asset
export const NATIVE_ASSET = 'XLM';

// Explorer URL
export const STELLAR_EXPERT_URL = 'https://stellar.expert/explorer/testnet';