import { useState } from 'react';
import type { FormEvent } from 'react';
import { useWallet } from '../hooks/useWallet';
import { sendPayment, isValidAddress, shortenAddress } from '../utils/stellar';
import { UI_MESSAGES, NATIVE_ASSET } from '../utils/constants';
import { InputField } from './ui/InputField';
import { PrimaryButton } from './ui/PrimaryButton';
import { motion, AnimatePresence } from 'framer-motion';

const SendPayment = () => {
    const { publicKey, isConnected, refreshBalance, connect, isLoading } = useWallet();
    const [formData, setFormData] = useState({
        destination: '',
        amount: '',
        memo: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const recipientPreview = formData.destination ? shortenAddress(formData.destination, 6) : '—';

    const handlePasteRecipient = async () => {
        try {
            const text = await navigator.clipboard.readText();
            const trimmed = text.trim();
            if (trimmed) {
                setFormData((prev) => ({ ...prev, destination: trimmed }));
            }
        } catch {
            setError('Clipboard access denied. Please paste manually.');
        }
    };

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

        if (formData.destination === publicKey) {
            setError('Recipient address must be different from your wallet');
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
            const message = err instanceof Error ? err.message : UI_MESSAGES.transactionFailed;
            setError(message || UI_MESSAGES.transactionFailed);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl shadow-black/30 backdrop-blur"
        >
                <div className="space-y-6 text-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-11 h-11 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Send XLM to Another Account</h3>
                        <p className="text-sm text-slate-400">Fast, secure transfers on Stellar Testnet</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto text-left">
                    <InputField
                        label="Recipient Address"
                        type="text"
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        disabled={!isConnected || isSubmitting}
                        placeholder="G..."
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        }
                        rightElement={
                            <button
                                type="button"
                                onClick={handlePasteRecipient}
                                className="text-xs font-semibold text-indigo-300 hover:text-indigo-200"
                            >
                                Paste
                            </button>
                        }
                        className="font-mono text-sm"
                    />
                    <p className="text-xs text-slate-500 -mt-2">Recipient must be a different account (G...)</p>

                    <InputField
                        label={`Amount (${NATIVE_ASSET})`}
                        type="number"
                        step="0.0000001"
                        min="0"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        disabled={!isConnected || isSubmitting}
                        placeholder="0.00"
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

                    <InputField
                        label="Memo (Optional)"
                        type="text"
                        maxLength={28}
                        value={formData.memo}
                        onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                        disabled={!isConnected || isSubmitting}
                        placeholder="Add a note (optional)"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                        }
                        rightElement={
                            <span className="text-xs text-slate-500">{formData.memo.length}/28</span>
                        }
                    />

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3"
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

                    <AnimatePresence>
                        {txHash && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-left"
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

                    <PrimaryButton
                        type={isConnected ? 'submit' : 'button'}
                        disabled={isSubmitting || isLoading}
                        loading={isSubmitting || isLoading}
                        onClick={!isConnected ? connect : undefined}
                        fullWidth
                    >
                        {!isSubmitting && !isLoading && (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        )}
                        {isSubmitting ? 'Sending Payment...' : isConnected ? 'Send XLM' : 'Connect Wallet to Send'}
                    </PrimaryButton>
                </form>

                <div className="pt-4 border-t border-white/5">
                    <div className="flex flex-col items-center gap-2 text-xs text-slate-500 text-center">
                        <span>From: {isConnected ? shortenAddress(publicKey || '') : '—'}</span>
                        <span>To: {recipientPreview}</span>
                        <span>Transactions are signed with Freighter and submitted to Stellar Testnet</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SendPayment;
