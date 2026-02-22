/**
 * Wallet State Management Hook
 * Manages Freighter wallet connection and state
 */

import { useState, useEffect, useCallback } from 'react';
import {
    isFreighterInstalled,
    connectWallet as connectToWallet,
    getAccountBalance,
} from '../utils/stellar';
import { UI_MESSAGES } from '../utils/constants';

interface WalletState {
    publicKey: string | null;
    balance: string;
    isConnected: boolean;
    isLoading: boolean;
    error: string | null;
    freighterInstalled: boolean;
}

export const useWallet = () => {
    const [state, setState] = useState<WalletState>({
        publicKey: null,
        balance: '0',
        isConnected: false,
        isLoading: false,
        error: null,
        freighterInstalled: false,
    });

    /**
     * Check if Freighter is installed on mount
     */
    useEffect(() => {
        const checkFreighter = async () => {
            const installed = await isFreighterInstalled();
            setState((prev) => ({ ...prev, freighterInstalled: installed }));
        };
        checkFreighter();
    }, []);

    /**
     * Connect to Freighter wallet
     */
    const connect = useCallback(async () => {
        if (!state.freighterInstalled) {
            setState((prev) => ({
                ...prev,
                error: UI_MESSAGES.walletNotInstalled,
            }));
            return;
        }

        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        try {
            const publicKey = await connectToWallet();
            const balance = await getAccountBalance(publicKey);

            setState((prev) => ({
                ...prev,
                publicKey,
                balance,
                isConnected: true,
                isLoading: false,
                error: null,
            }));

            // Store in localStorage for persistence
            localStorage.setItem('stellar_publicKey', publicKey);
        } catch (error) {
            console.error('Connection error:', error);
            setState((prev) => ({
                ...prev,
                isLoading: false,
                error: UI_MESSAGES.connectionFailed,
            }));
        }
    }, [state.freighterInstalled]);

    /**
     * Disconnect wallet
     */
    const disconnect = useCallback(() => {
        setState((prev) => ({
            ...prev,
            publicKey: null,
            balance: '0',
            isConnected: false,
            error: null,
        }));
        localStorage.removeItem('stellar_publicKey');
    }, []);

    /**
     * Refresh balance
     */
    const refreshBalance = useCallback(async () => {
        if (!state.publicKey) return;

        try {
            const balance = await getAccountBalance(state.publicKey);
            setState((prev) => ({ ...prev, balance }));
        } catch (error) {
            console.error('Error refreshing balance:', error);
        }
    }, [state.publicKey]);

    /**
     * Auto-connect on mount if previously connected
     */
    useEffect(() => {
        const savedPublicKey = localStorage.getItem('stellar_publicKey');
        if (savedPublicKey && state.freighterInstalled) {
            setState((prev) => ({ ...prev, isLoading: true }));

            getAccountBalance(savedPublicKey)
                .then((balance: string) => {
                    setState((prev) => ({
                        ...prev,
                        publicKey: savedPublicKey,
                        balance,
                        isConnected: true,
                        isLoading: false,
                    }));
                })
                .catch(() => {
                    // If balance fetch fails, clear stored key
                    localStorage.removeItem('stellar_publicKey');
                    setState((prev) => ({ ...prev, isLoading: false }));
                });
        }
    }, [state.freighterInstalled]);

    return {
        publicKey: state.publicKey,
        balance: state.balance,
        isConnected: state.isConnected,
        isLoading: state.isLoading,
        error: state.error,
        freighterInstalled: state.freighterInstalled,
        connect,
        disconnect,
        refreshBalance,
    };
};
