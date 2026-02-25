import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import WalletConnect from '../components/WalletConnect';
import Balance from '../components/Balance';
import SendPayment from '../components/SendPayment';

const DashboardPro = () => {
  const navigate = useNavigate();
  const { publicKey, isConnected, isChecking } = useWallet();

  useEffect(() => {
    if (!isConnected && !isChecking) {
      navigate('/', { replace: true });
    }
  }, [isConnected, isChecking, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Send XLM</h1>
          <p className="text-slate-400 mt-2">Transfer XLM from your wallet to another account</p>
        </div>

        <div className="flex justify-center">
          <WalletConnect />
        </div>

        <div className="grid gap-6 md:grid-cols-2 place-items-center">
          <div className="w-full max-w-md">
            {isConnected && publicKey && <Balance />}
          </div>
          <div className="w-full max-w-md">
            <SendPayment />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPro;
