import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WalletConnect from '../components/WalletConnect';
import { useWallet } from '../hooks/useWallet';

const Landing = () => {
  const navigate = useNavigate();
  const { isConnected, isChecking } = useWallet();

  useEffect(() => {
    if (isConnected && !isChecking) {
      navigate('/dashboard', { replace: true });
    }
  }, [isConnected, isChecking, navigate]);

  return (
    <div className="min-h-screen px-6 py-16 flex items-center justify-center overflow-x-hidden">
      <div className="w-full max-w-5xl grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <div className="space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-400">
            Stellar Payments
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-white">
            Premium Testnet Wallet Connection
          </h1>
          <p className="text-base text-slate-400 max-w-xl mx-auto lg:mx-0">
            Connect once and seamlessly move into your secure Send XLM dashboard. Built for fast, professional Web3
            payments.
          </p>
          <div className="grid gap-3 sm:grid-cols-3 text-left">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
              Instant Testnet transfers
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
              Freighter-signed security
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
              Clean, verified UX
            </div>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <WalletConnect />
        </div>
      </div>
    </div>
  );
};

export default Landing;
