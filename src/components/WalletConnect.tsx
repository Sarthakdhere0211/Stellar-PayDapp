import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../hooks/useWallet';
import { PrimaryButton } from './ui/PrimaryButton';

const WalletConnect = () => {
    const { isLoading, error, freighterInstalled, connect, isChecking } = useWallet();
    const friendlyError = freighterInstalled
        ? 'We could not connect to Freighter. Please try again.'
        : 'Freighter wallet was not detected. Install it to continue.';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/[0.06] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
        >
            <div className="space-y-6 text-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500/30 via-cyan-500/20 to-emerald-500/30 flex items-center justify-center border border-white/10">
                        <svg className="w-6 h-6 text-cyan-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Freighter Wallet</p>
                        <h2 className="text-2xl font-semibold text-white">Connect to Continue</h2>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Securely connect your Freighter wallet to access your balance and send XLM on Testnet.
                        </p>
                    </div>
                </div>

                <PrimaryButton
                    onClick={connect}
                    disabled={isLoading || isChecking || !freighterInstalled}
                    fullWidth
                    className="bg-white text-slate-950 hover:bg-slate-100"
                >
                    {isLoading ? 'Connecting...' : 'Connect Freighter Wallet'}
                </PrimaryButton>

                <AnimatePresence>
                    {(!freighterInstalled || error) && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-left text-sm text-amber-100"
                        >
                            {friendlyError}
                        </motion.div>
                    )}
                </AnimatePresence>

                {!freighterInstalled && (
                    <a
                        href="https://www.freighter.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                    >
                        Get Freighter Wallet
                    </a>
                )}
            </div>
        </motion.div>
    );
};

export default WalletConnect;
