/**
 * Send Payment Component
 * Premium Fintech UI with enhanced form
 */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useWallet } from '../hooks/useWallet';
import { sendPayment, isValidAddress } from '../utils/stellar';
import { UI_MESSAGES, NATIVE_ASSET } from '../utils/constants';
import { InputField } from './ui/InputField';
import { PrimaryButton } from './ui/PrimaryButton';
import { motion, AnimatePresence } from 'framer-motion';

const SendPayment = () => {
    const { publicKey, isConnected, refreshBalance } = useWallet();
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
            setError('Please fill in all required fields');
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
        } catch (err: any) {
            console.error('Payment error:', err);
            setError(err.message || UI_MESSAGES.transactionFailed);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isConnected) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-8 transition-all duration-300"
            >
                <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-slate-700/20 to-slate-800/20 flex items-center justify-center border border-white/5">
                        <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Wallet Required</h3>
                    <p className="text-slate-400">Connect your wallet to send payments</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-8 hover:border-white/20 transition-all duration-300"
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-md opacity-50" />
                        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Send Payment</h3>
                        <p className="text-sm text-slate-400">Transfer XLM instantly</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Destination Address */}
                    <InputField
                        label="Destination Address"
                        type="text"
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        disabled={isSubmitting}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        }
                        className="font-mono text-sm"
                    />

                    {/* Amount */}
                    <InputField
                        label={`Amount (${NATIVE_ASSET})`}
                        type="number"
                        step="0.0000001"
                        min="0"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        disabled={isSubmitting}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        }
                        rightElement={
                            <span className="text-sm font-bold text-indigo-400">{NATIVE_ASSET}</span>
                        }
                        className="text-lg font-semibold"
                    />

                    {/* Memo */}
                    <InputField
                        label="Memo (Optional)"
                        type="text"
                        maxLength={28}
                        value={formData.memo}
                        onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                        disabled={isSubmitting}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                        }
                        rightElement={
                            <span className="text-xs text-slate-500">{formData.memo.length}/28</span>
                        }
                    />

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3"
                            >
                                <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <p className="text-red-300 text-sm font-medium">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Success Message */}
                    <AnimatePresence>
                        {txHash && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl"
                            >
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                        <motion.svg
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                            className="w-5 h-5 text-emerald-400"
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
                                    <div className="flex-1">
                                        <p className="text-emerald-300 font-bold mb-1">{UI_MESSAGES.transactionSuccess}</p>
                                        <p className="text-xs text-slate-400 font-mono break-all mb-3">
                                            {txHash}
                                        </p>
                                        <a
                                            href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                                        >
                                            <span>View on Explorer</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <PrimaryButton
                        type="submit"
                        disabled={isSubmitting}
                        loading={isSubmitting}
                        fullWidth
                    >
                        {!isSubmitting && (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        )}
                        {isSubmitting ? 'Sending Payment...' : 'Send XLM'}
                    </PrimaryButton>
                </form>

                {/* Footer Info */}
                <div className="pt-4 border-t border-white/5">
                    <p className="text-xs text-center text-slate-500">
                        Transactions are signed with Freighter and submitted to Stellar Testnet
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default SendPayment;
