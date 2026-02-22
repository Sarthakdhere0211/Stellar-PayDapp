/**
 * Professional Stellar Dashboard - Exact UI Match
 * Single-page layout with glowing balance card
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { shortenAddress, formatXLM, sendPayment, isValidAddress } from '../utils/stellar';
import { UI_MESSAGES } from '../utils/constants';
import { motion, AnimatePresence } from 'framer-motion';

interface Toast {
  id: number;
  type: 'success' | 'processing' | 'error';
  message: string;
  txHash?: string;
}

const DashboardPro = () => {
  const navigate = useNavigate();
  const { publicKey, balance, isConnected, disconnect, refreshBalance } = useWallet();
  const [formData, setFormData] = useState({ destination: '', amount: '', memo: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: Toast['type'], message: string, txHash?: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message, txHash }]);
    if (type !== 'processing') {
      setTimeout(() => removeToast(id), 5000);
    }
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleMaxAmount = () => {
    const maxAmount = Math.max(0, parseFloat(balance) - 1);
    setFormData({ ...formData, amount: maxAmount.toFixed(7) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !isConnected) return;

    if (!formData.destination || !formData.amount) {
      addToast('error', 'Transaction Failed: Please fill in all fields');
      return;
    }

    if (!isValidAddress(formData.destination)) {
      addToast('error', UI_MESSAGES.invalidAddress);
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      addToast('error', 'Transaction Failed: Invalid amount');
      return;
    }

    if (amount > parseFloat(balance)) {
      addToast('error', 'Transaction Failed: Insufficient Balance');
      return;
    }

    setIsSubmitting(true);
    const processingId = Date.now();
    setToasts(prev => [...prev, { id: processingId, type: 'processing', message: 'Waiting for Freighter signature...' }]);

    try {
      const result = await sendPayment(
        publicKey,
        formData.destination,
        formData.amount,
        formData.memo || undefined
      );

      removeToast(processingId);
      addToast('success', 'Transaction Confirmed!', result.hash);
      setFormData({ destination: '', amount: '', memo: '' });
      setTimeout(() => refreshBalance(), 2000);
    } catch (err: unknown) {
      removeToast(processingId);
      addToast('error', `Transaction Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-gradient text-white flex flex-col items-center">
      {/* Header - Constrained and Centered */}
      <header className="glass-header">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent hidden sm:block">Stellar Wallet</h1>
            </div>

            {/* Center: Network Badge */}
            <div className="flex items-center">
              <div className="web3-badge text-orange-500 border-orange-500/20 bg-orange-500/10">
                Testnet
              </div>
            </div>

            {/* Right: Wallet Info */}
            {!isConnected ? (
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-200 font-bold text-sm transition-all shadow-lg shadow-white/10"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex flex-col items-end mr-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Connected Wallet</span>
                  <span className="text-xs font-mono text-cyan-400 font-medium">{shortenAddress(publicKey!, 4)}</span>
                </div>
                <button
                  onClick={disconnect}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-gray-400 hover:text-white"
                  title="Disconnect"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4-4H7m6 4v1H3v-1h10z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - Centered Layout */}
      <main className="w-full max-w-5xl px-6 py-12 flex flex-col items-center">
        {!isConnected ? (
          <div className="text-center py-32 flex flex-col items-center">
            <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-2xl backdrop-blur-xl">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9" />
              </svg>
            </div>
            <h2 className="text-3xl font-black mb-4 tracking-tight">Connect Your Wallet</h2>
            <p className="text-white/50 max-w-md">Access the Stellar network with Freighter to manage your XLM assets securely.</p>
          </div>
        ) : (
          <div className="w-full space-y-12 flex flex-col items-center">
            {/* Balance Card - The Hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl relative"
            >
              {/* Dual Glow Backdrops */}
              <div className="neon-glow-backdrop" />

              <div className="web3-card-premium p-12 group">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 blur-[80px] -ml-32 -mb-32" />

                <div className="relative flex flex-col items-center text-center">
                  <div className="flex items-center gap-2 mb-6 web3-badge">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-400 rounded-full blur-md opacity-50" />
                      <div className="relative w-1.5 h-1.5 bg-green-400 rounded-full" />
                    </div>
                    <span className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em]">Live Balance</span>
                  </div>

                  <h3 className="text-sm text-white/60 font-bold uppercase tracking-[0.3em] mb-4">Total Lumens</h3>

                  <div className="web3-hero-text mb-4">
                    {formatXLM(balance)} <span className="text-white/40 text-3xl font-medium tracking-tight ml-2">XLM</span>
                  </div>

                  <div className="h-1 w-24 bg-gradient-to-r from-blue-500 via-white/20 to-orange-500 rounded-full mt-4" />
                </div>
              </div>
            </motion.div>

            {/* Action Section */}
            <div className="w-full max-w-2xl grid grid-cols-1 gap-8">
              {/* Send XLM Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="web3-card-standard p-8 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-cyan-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold">Quick Send</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="relative group">
                      <input
                        type="text"
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        disabled={isSubmitting}
                        placeholder="Recipient Address (G...)"
                        className="web3-input"
                      />
                    </div>

                    <div className="relative group">
                      <div className="absolute left-0 top-0 bottom-0 flex items-center pl-5 pointer-events-none">
                        <span className="text-white/40 text-sm font-bold">XLM</span>
                      </div>
                      <input
                        type="text"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        disabled={isSubmitting}
                        placeholder="0.00"
                        className="web3-input pl-16 pr-20"
                      />
                      <button
                        type="button"
                        onClick={handleMaxAmount}
                        disabled={isSubmitting}
                        className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 text-[10px] font-black bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg transition-all text-white uppercase tracking-wider"
                      >
                        Max
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="web3-btn-primary group"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Broadcasting Transaction...
                      </>
                    ) : (
                      <>
                        Confirm and Send
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </motion.div>

            </div>
          </div>
        )}
      </main>

      {/* Toast Notifications */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 w-full max-w-md px-6">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`w-full rounded-2xl p-4 shadow-2xl backdrop-blur-3xl border border-white/10 flex items-start gap-4 ${toast.type === 'success'
                ? 'bg-green-500/90'
                : toast.type === 'processing'
                  ? 'bg-blue-600/90'
                  : 'bg-red-500/90'
                }`}
            >
              <div className="flex-shrink-0 mt-0.5 p-2 rounded-lg bg-white/20">
                {toast.type === 'success' && (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {toast.type === 'processing' && (
                  <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {toast.type === 'error' && (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className="text-white font-black text-sm uppercase tracking-wide mb-1 leading-tight">{toast.message}</p>
                {toast.txHash && (
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${toast.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 underline-offset-2 hover:underline"
                  >
                    View Explorer
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardPro;
