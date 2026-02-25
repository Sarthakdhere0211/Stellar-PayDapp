import { useCallback, useEffect, useState } from 'react';
import { getAccountBalance, isFreighterInstalled } from '../utils/stellar';
import { UI_MESSAGES } from '../utils/constants';

const STORAGE_KEY = 'stellar.paydapp.publicKey';

export const useWallet = () => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [freighterInstalled, setFreighterInstalled] = useState(true);

  const refreshBalance = useCallback(async () => {
    if (!publicKey) return;
    setIsBalanceLoading(true);
    try {
      const nextBalance = await getAccountBalance(publicKey);
      setBalance(nextBalance);
    } finally {
      setIsBalanceLoading(false);
    }
  }, [publicKey]);

  const loadConnection = useCallback(async () => {
    const installed = await isFreighterInstalled();
    setFreighterInstalled(installed);
    if (!installed) {
      setError(UI_MESSAGES.walletNotInstalled);
      setIsChecking(false);
      setIsBalanceLoading(false);
      return;
    }

    try {
      setIsBalanceLoading(true);
      let storedKey: string | null = null;
      try {
        storedKey = localStorage.getItem(STORAGE_KEY);
      } catch (err) {
        void err;
      }
      if (storedKey) {
        setPublicKey(storedKey);
        setIsConnected(true);
        const nextBalance = await getAccountBalance(storedKey);
        setBalance(nextBalance);
      }
      const freighterApi: any = await import('@stellar/freighter-api');
      const connection = await freighterApi.isConnected();
      if (connection?.isConnected) {
        const pk = await freighterApi.getPublicKey();
        setPublicKey(pk);
        setIsConnected(true);
        const nextBalance = await getAccountBalance(pk);
        setBalance(nextBalance);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : UI_MESSAGES.connectionFailed);
    } finally {
      setIsChecking(false);
      setIsBalanceLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConnection();
  }, [loadConnection]);

  const connect = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const freighterApi: any = await import('@stellar/freighter-api');
      const access = await freighterApi.requestAccess();
      let pk = '';
      if (typeof access === 'string') pk = access;
      if (!pk && access && typeof access === 'object' && 'address' in access) pk = String(access.address);
      if (!pk && access && typeof access === 'object' && 'publicKey' in access) pk = String(access.publicKey);
      if (!pk && freighterApi.getPublicKey) pk = await freighterApi.getPublicKey();
      setPublicKey(pk);
      setIsConnected(true);
      try {
        localStorage.setItem(STORAGE_KEY, pk);
      } catch (err) {
        void err;
      }
      setIsBalanceLoading(true);
      const nextBalance = await getAccountBalance(pk);
      setBalance(nextBalance);
    } catch (err) {
      setError(err instanceof Error ? err.message : UI_MESSAGES.connectionFailed);
    } finally {
      setIsBalanceLoading(false);
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setPublicKey(null);
    setIsConnected(false);
    setBalance('0');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      void err;
    }
  }, []);

  return {
    publicKey,
    isConnected,
    balance,
    isLoading,
    isChecking,
    isBalanceLoading,
    error,
    freighterInstalled,
    connect,
    disconnect,
    refreshBalance,
  };
};
