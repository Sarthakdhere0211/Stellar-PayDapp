/**
 * Balance Display Component
 * Premium UI with count-up animation
 */

import { useWallet } from '../hooks/useWallet';
import { formatXLM } from '../utils/stellar';
import { NATIVE_ASSET } from '../utils/constants';
import { motion } from 'framer-motion';
import { useCountUp } from '../hooks/useCountUp';
import { useState, useEffect } from 'react';

const Balance = () => {
    const { balance, isConnected, refreshBalance } = useWallet();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [prevBalance, setPrevBalance] = useState(0);
    
    const numericBalance = parseFloat(balance) || 0;
    const animatedBalance = useCountUp(numericBalance, 1000, prevBalance);

    useEffect(() => {
        setPrevBalance(numericBalance);
    }, [numericBalance]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refreshBalance();
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    if (!isConnected) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-6 hover:border-white/20 transition-all duration-300"
        >
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur-md opacity-50" />
                            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Balance</p>
                            <p className="text-sm text-slate-400 font-medium">Available Funds</p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 180 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="p-2.5 hover:bg-cyan-500/10 rounded-xl transition-all duration-300 border border-white/5 hover:border-cyan-500/30 disabled:opacity-50"
                        title="Refresh balance"
                    >
                        <motion.svg
                            animate={{ rotate: isRefreshing ? 360 : 0 }}
                            transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
                            className="w-5 h-5 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </motion.svg>
                    </motion.button>
                </div>

                {/* Balance Display */}
                <div>
                    <div className="flex items-baseline gap-3">
                        <motion.span
                            key={balance}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-bold bg-gradient-to-r from-white to-slate-100 bg-clip-text text-transparent tracking-tight leading-tight"
                        >
                            {formatXLM(animatedBalance.toFixed(7))}
                        </motion.span>
                        <span className="text-lg font-semibold text-cyan-400">{NATIVE_ASSET}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">Stellar Lumens</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                    <div className="bg-white/[0.02] rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-xs text-slate-500 font-semibold">Network</span>
                        </div>
                        <p className="text-sm font-bold text-emerald-300">Testnet</p>
                    </div>
                    <div className="bg-white/[0.02] rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-xs text-slate-500 font-semibold">Status</span>
                        </div>
                        <p className="text-sm font-bold text-blue-300">Active</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Balance;
