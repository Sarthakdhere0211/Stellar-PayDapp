/**
 * Wallet Connection Component
 * Premium Fintech UI
 */

import { useWallet } from '../hooks/useWallet';
import { shortenAddress } from '../utils/stellar';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PrimaryButton } from './ui/PrimaryButton';

const WalletConnect = () => {
    const { publicKey, isConnected, isLoading, error, freighterInstalled, connect, disconnect } =
        useWallet();
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        if (publicKey) {
            navigator.clipboard.writeText(publicKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!freighterInstalled) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-6 transition-all duration-300"
            >
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-red-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base font-semibold text-white mb-2">Wallet Required</h3>
                        <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                            Install Freighter wallet to get started with secure XLM transfers.
                        </p>
                        <a
                            href="https://www.freighter.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <PrimaryButton variant="danger" size="md">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                Install Freighter
                            </PrimaryButton>
                        </a>
                    </div>
                </div>
            </motion.div>
        );
    }

    if (isConnected && publicKey) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-6 hover:border-white/10 transition-all duration-300"
            >
                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-500 rounded-xl blur-md opacity-50" />
                                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                                    <motion.svg
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                        className="w-5 h-5 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </motion.svg>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Connected</p>
                                <p className="text-base font-black text-white font-mono">{shortenAddress(publicKey, 6)}</p>
                            </div>
                        </div>
                        <PrimaryButton
                            onClick={disconnect}
                            variant="ghost"
                            size="sm"
                        >
                            Disconnect
                        </PrimaryButton>
                    </div>

                    {/* Address Display */}
                    <div className="relative">
                        <div className="flex items-center gap-2 bg-black/20 border border-white/5 rounded-xl px-4 py-3 group/address hover:border-blue-500/30 transition-all duration-300">
                            <p className="text-xs text-slate-400 font-mono break-all flex-1">
                                {publicKey}
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={copyToClipboard}
                                className="flex-shrink-0 p-2 hover:bg-blue-500/10 rounded-lg transition-all duration-300 relative"
                                title="Copy address"
                            >
                                <AnimatePresence mode="wait">
                                    {copied ? (
                                        <motion.svg
                                            key="check"
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            exit={{ scale: 0, rotate: 180 }}
                                            className="w-4 h-4 text-emerald-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </motion.svg>
                                    ) : (
                                        <motion.svg
                                            key="copy"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="w-4 h-4 text-slate-400 group-hover/address:text-blue-400 transition-colors"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                            />
                                        </motion.svg>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>
                        <AnimatePresence>
                            {copied && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute -top-12 right-0 bg-emerald-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg font-semibold"
                                >
                                    Copied!
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-6 hover:border-white/20 transition-all duration-300"
        >
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base font-semibold text-white mb-1">Connect Wallet</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Connect Freighter to access your XLM balance and send payments
                        </p>
                    </div>
                </div>

                <PrimaryButton
                    onClick={connect}
                    disabled={isLoading}
                    loading={isLoading}
                    fullWidth
                >
                    {!isLoading && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    )}
                    {isLoading ? 'Connecting...' : 'Connect Freighter'}
                </PrimaryButton>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2"
                        >
                            <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-300 text-sm font-medium">{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default WalletConnect;
