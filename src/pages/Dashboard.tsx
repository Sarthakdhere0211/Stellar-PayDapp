import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../hooks/useWallet';
import { formatXLM, shortenAddress } from '../utils/stellar';
import { NATIVE_ASSET } from '../utils/constants';
import SendXLMForm from '../components/SendXLMForm';
import { PrimaryButton } from '../components/ui/PrimaryButton';

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    publicKey,
    isConnected,
    isChecking,
    balance,
    isBalanceLoading,
    disconnect,
    refreshBalance,
  } = useWallet();
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!isConnected && !isChecking) {
      navigate('/', { replace: true });
    }
  }, [isConnected, isChecking, navigate]);

  const formattedBalance = useMemo(() => formatXLM(balance), [balance]);

  const handleCopy = async () => {
    if (!publicKey) return;
    try {
      await navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshBalance();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="min-h-screen px-6 py-12 overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Stellar Testnet</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-white">Send XLM</h1>
          <p className="text-slate-400">Transfer funds instantly with your Freighter wallet.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-[28px] border border-white/10 bg-white/[0.06] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
          >
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Wallet</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Connected</p>
                      <p className="text-base font-semibold text-white font-mono">
                        {publicKey ? shortenAddress(publicKey, 6) : '—'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-300 hover:text-white hover:border-white/30 transition-colors"
                  >
                    Copy
                  </button>
                  <PrimaryButton variant="ghost" size="sm" onClick={disconnect}>
                    Disconnect
                  </PrimaryButton>
                </div>
              </div>

              <AnimatePresence>
                {copied && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-100"
                  >
                    Address copied
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Balance</p>
                    {isBalanceLoading || isChecking ? (
                      <div className="space-y-2">
                        <div className="h-6 w-40 rounded-full bg-white/10 animate-pulse" />
                        <div className="h-4 w-24 rounded-full bg-white/10 animate-pulse" />
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-semibold text-white">{formattedBalance}</span>
                        <span className="text-sm font-semibold text-cyan-300">{NATIVE_ASSET}</span>
                      </div>
                    )}
                    <p className="text-sm text-slate-500">Available on Testnet</p>
                  </div>
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-300 hover:text-white hover:border-white/30 transition-colors disabled:opacity-50"
                  >
                    {isRefreshing ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <p className="text-xs text-slate-500 uppercase tracking-[0.3em]">Network</p>
                  <p className="text-sm text-emerald-200 mt-1">Testnet</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <p className="text-xs text-slate-500 uppercase tracking-[0.3em]">Status</p>
                  <p className="text-sm text-cyan-200 mt-1">Ready to send</p>
                </div>
              </div>
            </div>
          </motion.div>

          <SendXLMForm />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
