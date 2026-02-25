import { useEffect, useRef } from 'react';
import { useWallet } from './hooks/useWallet';
import WalletConnect from './components/WalletConnect';
import Balance from './components/Balance';
import SendPayment from './components/SendPayment';

function App() {
  const { publicKey, isConnected } = useWallet();
  const gridColumns = isConnected ? 'md:grid-cols-2' : 'md:grid-cols-1';
  const sendSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isConnected) {
      sendSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isConnected]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(99,102,241,0.14),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzRTFCREIiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-100 pointer-events-none" />

      <div className="relative z-10">
        <header className="border-b border-white/10 bg-white/[0.02]">
          <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-3 justify-center">
              <div className="w-10 h-10 bg-gradient-to-br from-stellar-500 to-stellar-700 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h1 className="text-white font-semibold text-lg">Stellar Payment</h1>
                <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full">
                  TESTNET
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-400 justify-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              Test Network
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-10 flex flex-col items-center">
          {!isConnected && (
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-semibold text-white mb-3">
                Send XLM to Another Account
              </h2>
              <p className="text-slate-400 text-base max-w-xl mx-auto">
                Connect your Freighter wallet to send XLM to any Stellar account on the TESTNET.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-slate-300">
                  Instant Settlements
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-slate-300">
                  Freighter Signed
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-slate-300">
                  Testnet Safe
                </span>
              </div>
            </div>
          )}

          <section className="w-full flex justify-center mb-8">
            <WalletConnect />
          </section>

          <div className={`w-full grid gap-6 ${gridColumns} place-items-center`}>
            <section className="w-full max-w-md mx-auto">
              {isConnected && publicKey && <Balance />}
            </section>
            <section className="w-full max-w-md mx-auto" ref={sendSectionRef}>
              <SendPayment />
            </section>
          </div>

          {!isConnected && (
            <div className="w-full grid gap-6 md:grid-cols-3 place-items-center mt-10">
              <div className="w-full max-w-sm mx-auto bg-white/[0.03] border border-white/10 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-stellar-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-stellar-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">Secure</h3>
                <p className="text-slate-400 text-sm">Sign transactions safely with Freighter wallet</p>
              </div>

              <div className="w-full max-w-sm mx-auto bg-white/[0.03] border border-white/10 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-stellar-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-stellar-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">Fast</h3>
                <p className="text-slate-400 text-sm">Transactions settle in seconds</p>
              </div>

              <div className="w-full max-w-sm mx-auto bg-white/[0.03] border border-white/10 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-stellar-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-stellar-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">Safe</h3>
                <p className="text-slate-400 text-sm">Testnet only — no real funds at risk</p>
              </div>
            </div>
          )}
        </main>

        <footer className="border-t border-white/10 mt-10">
          <div className="max-w-5xl mx-auto px-6 py-6">
            <div className="flex flex-col items-center gap-4 text-sm text-slate-500 text-center">
              <p>Built with Stellar SDK & Freighter Wallet</p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Stellar.org
                </a>
                <a href="https://laboratory.stellar.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Stellar Lab
                </a>
                <a href="https://stellar.expert" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Stellar Expert
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
