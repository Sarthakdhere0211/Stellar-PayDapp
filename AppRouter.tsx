/**
 * App Router - Main Application Routes
 * Modern Stellar Testnet dApp
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import DashboardPro from './pages/DashboardPro';
import { AnimatedBackground } from './components/AnimatedBackground';

function AppRouter() {
  return (
    <BrowserRouter>
      <div className="relative">
        <AnimatedBackground />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<DashboardPro />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default AppRouter;
