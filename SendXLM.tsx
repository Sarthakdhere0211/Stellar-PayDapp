/**
 * Send XLM Page - Perfect Send Transaction Form
 * Enter receiver address, amount, and send XLM
 */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { sendPayment, isValidAddress } from '../utils/stellar';
import { UI_MESSAGES, NATIVE_ASSET } from '../utils/constants';
import { motion } from 'framer-motion';

const SendXLM = () => {
  const navigate = useNavigate();
  const { publicKey, isConnected, refreshBalance, disconnect } = useWallet();
  const [formData, setFormData] = useState({
    destination: '',
    amount: '',
    memo: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!publicKey || !isConnected) return;

    setError(null);
    setTxHash(null);

    if (!formData.destination || !formData.amount) {
      setError('Please fill in receiver address and amount');
      return;
    }

    if (!isValidAddress(formData.destination)) {
      setError(UI_MESSAGES.invalidAddress);
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await sendPayment(
        publicKey,
        formData.destination,
        formData.amount,
        formData.memo || undefined
      );

      setTxHash(result.hash);
      setFormData({ destination: '', amount: '', memo: '' });
      setTimeout(() => refreshBalance(), 2000);
    } catch (err: unknown) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : UI_MESSAGES.transactionFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setTxHash(null);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setFormData({ ...formData, destination: text });
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  };

  if (!isConnected) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/20 backdrop-blur-xl bg-gradient-to-r from-white/[0.05] to-white/[0.02] shadow-lg">
        <div className="mx-auto max-w-2xl px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2.5 hover:bg-white/10 rounded-xl transition-all border-2 border-white/10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">Send XLM</h1>
                <p className="text-xs text-slate-400 font-semibold">Transfer Stellar Lumens</p>
              </div>
            </div>
            <button
              onClick={disconnect}
              className="px-4 py-2 text-sm font-black rounded-xl border-2 border-red-400/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 transition-all"
            >
              Disconnect
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl rounded-2xl border-2 border-white/20 bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-xl p-10 shadow-2xl"
        >
          {!txHash && !error && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border-2 border-blue-400/30">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <h2 className="text-2xl font-black mb-2">Send Payment</h2>
                <p className="text-slate-400 font-medium">Enter receiver details below</p>
              </div>

              {/* Receiver Address */}
              <div>
                <label className="block text-sm font-black tracking-wide mb-3 text-slate-200">RECEIVER WALLET ADDRESS</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    disabled={isSubmitting}
                    placeholder="G..."
                    className="w-full px-5 py-4 bg-black/30 border-2 border-white/20 rounded-xl text-sm font-mono font-semibold focus:border-cyan-400/50 focus:outline-none transition-all disabled:opacity-50 pr-14"
                  />
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-all"
                    title="Paste address"
                  >
                    <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-black tracking-wide mb-3 text-slate-200">AMOUNT TO SEND ({NATIVE_ASSET})</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.0000001"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    disabled={isSubmitting}
                    placeholder="0.00"
                    className="w-full px-5 py-4 bg-black/30 border-2 border-white/20 rounded-xl text-xl font-black focus:border-cyan-400/50 focus:outline-none transition-all disabled:opacity-50 pr-20"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-base font-black text-cyan-400">
                    {NATIVE_ASSET}
                  </div>
                </div>
              </div>

              {/* Memo (Optional) */}
              <div>
                <label className="block text-sm font-black tracking-wide mb-3 text-slate-200">MEMO (OPTIONAL)</label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={28}
                    value={formData.memo}
                    onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                    disabled={isSubmitting}
                    placeholder="Add a note..."
                    className="w-full px-5 py-4 bg-black/30 border-2 border-white/20 rounded-xl text-sm font-semibold focus:border-cyan-400/50 focus:outline-none transition-all disabled:opacity-50 pr-20"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    {formData.memo.length}/28
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-5 rounded-xl bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 hover:from-blue-600 hover:via-blue-700 hover:to-cyan-600 font-black text-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-8 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 border border-blue-400/20"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={3}>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    SENDING TRANSACTION...
                  </>
                ) : (
                  <>
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    SEND TRANSACTION
                  </>
                )}
              </button>
            </form>
          )}

          {/* Success State */}
          {txHash && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-xl opacity-40" />
                <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-xl">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-black mb-4 text-emerald-300">Transaction Successful!</h3>
              <p className="text-sm text-slate-300 font-semibold mb-2">Transaction Hash:</p>
              <p className="text-xs text-slate-300 font-mono break-all mb-6 bg-black/30 p-4 rounded-xl border-2 border-emerald-500/30 font-semibold">
                {txHash}
              </p>
              <div className="space-y-3">
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 border-2 border-emerald-400/30 text-white font-black text-lg hover:shadow-xl hover:shadow-emerald-500/30 transition-all"
                >
                  VIEW ON EXPLORER
                </a>
                <button
                  onClick={() => navigate('/')}
                  className="block w-full px-6 py-4 rounded-xl border-2 border-white/20 hover:bg-white/10 font-black text-lg transition-all"
                >
                  BACK TO DASHBOARD
                </button>
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-red-500 rounded-2xl blur-xl opacity-40" />
                <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-xl">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-black mb-4 text-red-300">Transaction Failed</h3>
              <p className="text-sm text-slate-300 mb-6 bg-red-500/10 p-4 rounded-xl border-2 border-red-500/30 font-semibold">
                {error}
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleRetry}
                  className="block w-full px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 hover:from-blue-600 hover:via-blue-700 hover:to-cyan-600 font-black text-lg transition-all shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 border border-blue-400/20"
                >
                  TRY AGAIN
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="block w-full px-6 py-4 rounded-xl border-2 border-white/20 hover:bg-white/10 font-black text-lg transition-all"
                >
                  BACK TO DASHBOARD
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default SendXLM;
