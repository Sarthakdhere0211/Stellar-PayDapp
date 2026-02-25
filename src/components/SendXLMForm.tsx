import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../hooks/useWallet';
import { isValidAddress, sendPayment, shortenAddress } from '../utils/stellar';
import { NATIVE_ASSET, STELLAR_EXPERT_URL, UI_MESSAGES } from '../utils/constants';
import { InputField } from './ui/InputField';
import { PrimaryButton } from './ui/PrimaryButton';

const SendXLMForm = () => {
  const { publicKey, isConnected, balance } = useWallet();
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const numericBalance = useMemo(() => Number.parseFloat(balance || '0') || 0, [balance]);
  const destinationPreview = destination ? shortenAddress(destination, 6) : '—';

  const validate = () => {
    if (!destination || !amount) {
      return 'Please enter a destination and amount.';
    }
    if (!isValidAddress(destination)) {
      return 'Enter a valid Stellar public key starting with G.';
    }
    if (publicKey && destination === publicKey) {
      return 'Recipient address must be different from your wallet.';
    }
    const parsedAmount = Number.parseFloat(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return 'Enter a valid amount greater than zero.';
    }
    if (parsedAmount > numericBalance) {
      return 'Amount exceeds your available balance.';
    }
    return null;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!publicKey || !isConnected) return;
    setError(null);
    setTxHash(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await sendPayment(publicKey, destination, amount, memo || undefined);
      setTxHash(result.hash);
      setDestination('');
      setAmount('');
      setMemo('');
    } catch (err) {
      const message = err instanceof Error ? err.message : UI_MESSAGES.transactionFailed;
      if (message.toLowerCase().includes('rejected')) {
        setError('Transaction cancelled in Freighter.');
      } else {
        setError('We could not send the payment. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasteRecipient = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const trimmed = text.trim();
      if (trimmed) {
        setDestination(trimmed);
      }
    } catch {
      setError('Clipboard access is blocked. Paste the address manually.');
    }
  };

  const handleCopyHash = async () => {
    if (!txHash) return;
    try {
      await navigator.clipboard.writeText(txHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-[28px] border border-white/10 bg-white/[0.06] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
    >
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Send Payment</p>
          <h2 className="text-2xl font-semibold text-white">Send XLM to Another Account</h2>
          <p className="text-sm text-slate-400">Fast, secure transfers on Stellar Testnet.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Destination Public Key"
            type="text"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            disabled={!isConnected || isSubmitting}
            placeholder="G..."
            className="font-mono text-sm"
            rightElement={
              <button
                type="button"
                onClick={handlePasteRecipient}
                className="text-xs font-semibold text-cyan-200 hover:text-white"
              >
                Paste
              </button>
            }
          />

          <InputField
            label={`Amount (${NATIVE_ASSET})`}
            type="number"
            step="0.0000001"
            min="0"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            disabled={!isConnected || isSubmitting}
            placeholder="0.00"
            className="text-lg font-semibold"
            rightElement={<span className="text-xs font-semibold text-cyan-200">{NATIVE_ASSET}</span>}
          />

          <InputField
            label="Memo (Optional)"
            type="text"
            maxLength={28}
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            disabled={!isConnected || isSubmitting}
            placeholder="Add a short note"
            rightElement={<span className="text-xs text-slate-500">{memo.length}/28</span>}
          />

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {txHash && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-100"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold">Payment sent successfully</p>
                    <button
                      type="button"
                      onClick={handleCopyHash}
                      className="text-xs text-emerald-200 hover:text-white"
                    >
                      {copied ? 'Copied' : 'Copy hash'}
                    </button>
                  </div>
                  <p className="break-all text-xs text-emerald-100/80">{txHash}</p>
                  <a
                    href={`${STELLAR_EXPERT_URL}/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-emerald-200 hover:text-white"
                  >
                    View on Explorer
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <PrimaryButton
            type="submit"
            disabled={!isConnected || isSubmitting}
            fullWidth
            className="bg-white text-slate-950 hover:bg-slate-100"
          >
            {isSubmitting ? 'Sending...' : 'Send XLM'}
          </PrimaryButton>
        </form>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-slate-400">
          <div className="flex items-center justify-between gap-2">
            <span>From</span>
            <span className="font-mono text-slate-200">{publicKey ? shortenAddress(publicKey, 6) : '—'}</span>
          </div>
          <div className="flex items-center justify-between gap-2 mt-2">
            <span>To</span>
            <span className="font-mono text-slate-200">{destinationPreview}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SendXLMForm;
