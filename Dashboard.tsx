/**
 * Dashboard Page - Perfect Wallet Dashboard
 * Connect wallet, view balance, navigate to send
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { shortenAddress, formatXLM } from '../utils/stellar';
import { NATIVE_ASSET } from '../utils/constants';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const navigate = useNavigate();
  const { publicKey, balance, isConnected, isLoading, freighterInstalled, connect, disconnect, refreshBalance } = useWallet();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshBalance();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/20 backdrop-blur-xl bg-gradient-to-r from-white/[0.05] to-white/[0.02] shadow-lg">
        <div className="mx-auto max-w-2xl px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl blur-md opacity-60" />
                <div className="relative w-11 h-11 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-xl">
                  <svg className="w-6 h-6 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">Stellar Pay</h1>
                <p className="text-xs text-slate-400 font-semibold">XLM Payment App</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-2 border-emerald-400/40 shadow-lg shadow-emerald-500/20">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
              <span className="text-xs font-black text-emerald-300 tracking-wide">TESTNET</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Not Installed State */}
          {!freighterInstalled ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border-2 border-white/20 bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-xl p-12 shadow-2xl text-center"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center border-2 border-red-400/30 shadow-xl">
                <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-3xl font-black mb-4">Freighter Wallet Required</h2>
              <p className="text-slate-300 mb-8 text-lg font-medium">Install the Freighter browser extension to use Stellar Pay</p>
              <a href="https://www.freighter.app/" target="_blank" rel="noopener noreferrer">
                <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-red-500 via-red-600 to-orange-500 hover:from-red-600 hover:via-red-700 hover:to-orange-600 font-black text-lg transition-all shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/40 border border-red-400/20">
                  Install Freighter Wallet
                </button>
              </a>
            </motion.div>
          ) : !isConnected ? (
            /* Not Connected State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border-2 border-white/20 bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-xl p-12 shadow-2xl text-center"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border-2 border-blue-400/30 shadow-xl">
                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9" />
                </svg>
              </div>
              <h2 className="text-3xl font-black mb-4">Connect Your Wallet</h2>
              <p className="text-slate-300 mb-8 text-lg font-medium">Connect your Freighter wallet to start sending XLM</p>
              <button
                onClick={connect}
                disabled={isLoading}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 hover:from-blue-600 hover:via-blue-700 hover:to-cyan-600 font-black text-lg transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 border border-blue-400/20 mx-auto"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={3}>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Connect Wallet
                  </>
                )}
              </button>
            </motion.div>
          ) : (
            /* Connected State - Dashboard */
            <div className="space-y-6">
              {/* Wallet Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border-2 border-white/20 bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-xl p-8 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-500 rounded-xl blur-md opacity-40" />
                      <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-emerald-400 font-black tracking-wider mb-1">WALLET CONNECTED</p>
                      <p className="text-xl font-mono font-black">{shortenAddress(publicKey!, 8)}</p>
                    </div>
                  </div>
                  <button
                    onClick={disconnect}
                    className="px-5 py-2.5 text-sm font-black rounded-xl border-2 border-red-400/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 transition-all"
                  >
                    Disconnect
                  </button>
                </div>
                <div className="flex items-center gap-3 bg-black/30 rounded-xl px-5 py-4 border-2 border-white/10">
                  <p className="text-sm text-slate-300 font-mono flex-1 truncate font-semibold">{publicKey}</p>
                  <button
                    onClick={copyAddress}
                    className="p-2.5 hover:bg-white/10 rounded-lg transition-all"
                    title="Copy address"
                  >
                    {copied ? (
                      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Balance Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border-2 border-white/20 bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-xl p-10 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl blur-md opacity-50" />
                      <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm text-cyan-400 font-black tracking-wider">YOUR BALANCE</p>
                  </div>
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="p-3 hover:bg-white/10 rounded-xl transition-all border-2 border-white/10"
                    title="Refresh balance"
                  >
                    <svg
                      className={`w-6 h-6 text-slate-300 ${isRefreshing ? 'animate-spin' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                <div className="mb-10">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-6xl font-black bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent tracking-tight">
                      {formatXLM(balance)}
                    </span>
                    <span className="text-3xl font-black text-cyan-400">{NATIVE_ASSET}</span>
                  </div>
                  <p className="text-sm text-slate-400 font-bold">Stellar Lumens</p>
                </div>
                <button
                  onClick={() => navigate('/send')}
                  className="w-full px-6 py-5 rounded-xl bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 hover:from-blue-600 hover:via-blue-700 hover:to-cyan-600 font-black text-xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 border border-blue-400/20"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send XLM
                </button>
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
