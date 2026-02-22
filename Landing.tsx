/**
 * Landing Page - Pixel-Accurate Futuristic Stellar Wallet
 * Premium dark neon crypto dashboard
 */

import { useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const Landing = () => {
  const navigate = useNavigate();
  const { isConnected, isLoading, freighterInstalled, connect } = useWallet();

  useEffect(() => {
    if (isConnected) {
      navigate('/dashboard');
    }
  }, [isConnected, navigate]);

  const handleConnect = async () => {
    if (!freighterInstalled) {
      window.open('https://www.freighter.app/', '_blank');
      return;
    }
    
    try {
      await connect();
      // Wait a bit for the connection to be established
      setTimeout(() => {
        if (isConnected) {
          navigate('/dashboard');
        }
      }, 500);
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-radial from-[#0f1729] via-[#0a0e1a] to-[#000000] text-white flex flex-col relative overflow-hidden">
      {/* Subtle center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 backdrop-blur-md bg-white/[0.02]">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Stellar Wallet</span>
            </div>

            {/* Connect Button */}
            <button
              onClick={handleConnect}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 font-semibold transition-all disabled:opacity-50 shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30"
            >
              {isLoading ? 'Connecting...' : freighterInstalled ? 'Connect Wallet' : 'Install Freighter'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-16">
        <div className="mx-auto max-w-5xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            {/* Hero Glass Card - Centerpiece */}
            <div className="relative">
              {/* Dual Glow Effect */}
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
              
              {/* Glass Card */}
              <div className="relative rounded-3xl backdrop-blur-md bg-white/[0.03] border border-white/10 p-20 shadow-2xl">
                {/* Inner glow border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 via-transparent to-orange-500/10 pointer-events-none" />
                
                {/* Floating particles */}
                <div className="absolute top-12 left-12 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                <div className="absolute top-24 right-20 w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-20 left-24 w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-12 right-16 w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
                <div className="absolute top-1/2 left-16 w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/3 right-12 w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '2.5s' }} />

                {/* Futuristic Wallet Network Illustration */}
                <div className="relative flex items-center justify-center">
                  <svg className="w-64 h-64" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Central wallet icon */}
                    <circle cx="100" cy="100" r="30" stroke="#3B82F6" strokeWidth="2" fill="none" opacity="0.3" />
                    <circle cx="100" cy="100" r="25" stroke="#3B82F6" strokeWidth="2" fill="none" />
                    <path d="M90 95h20M90 100h20M90 105h20" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                    
                    {/* Network nodes */}
                    <circle cx="50" cy="50" r="8" fill="#3B82F6" opacity="0.6" />
                    <circle cx="150" cy="50" r="8" fill="#06B6D4" opacity="0.6" />
                    <circle cx="50" cy="150" r="8" fill="#F59E0B" opacity="0.6" />
                    <circle cx="150" cy="150" r="8" fill="#3B82F6" opacity="0.6" />
                    
                    {/* Connection lines */}
                    <line x1="50" y1="50" x2="75" y2="75" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
                    <line x1="150" y1="50" x2="125" y2="75" stroke="#06B6D4" strokeWidth="1" opacity="0.3" />
                    <line x1="50" y1="150" x2="75" y2="125" stroke="#F59E0B" strokeWidth="1" opacity="0.3" />
                    <line x1="150" y1="150" x2="125" y2="125" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
                    
                    {/* Outer ring */}
                    <circle cx="100" cy="100" r="70" stroke="#3B82F6" strokeWidth="1" fill="none" opacity="0.2" strokeDasharray="4 4">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 100 100"
                        to="360 100 100"
                        dur="20s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </svg>
                </div>
              </div>
            </div>

            {/* Hero Text Section */}
            <div className="text-center space-y-6">
              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl font-bold text-white tracking-tight"
              >
                Unlock the Power of Stellar
              </motion.h1>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-lg text-gray-400 max-w-2xl mx-auto"
              >
                Connect your Freighter wallet to explore of Stellar Testnet.
              </motion.p>

              {/* Primary CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="pt-4"
              >
                <button
                  onClick={handleConnect}
                  disabled={isLoading}
                  className="group relative px-10 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 font-bold text-white transition-all disabled:opacity-50 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95"
                >
                  {/* Button glow */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 blur-xl opacity-50 group-hover:opacity-75 transition-opacity -z-10" />
                  
                  <span className="relative flex items-center gap-2">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Connecting...
                      </>
                    ) : (
                      'Connect Wallet'
                    )}
                  </span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
