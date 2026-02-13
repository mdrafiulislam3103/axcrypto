
import React from 'react';
import { PaymentMethod } from '../types';

interface BuyModalProps {
  onClose: () => void;
  paymentMethods: PaymentMethod[];
  showNotification: (msg: string) => void;
}

const BuyModal: React.FC<BuyModalProps> = ({ onClose, paymentMethods, showNotification }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification("Buy request submitted! Admin will review shortly.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card w-full max-w-lg rounded-2xl border border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-8 relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-2xl hover:text-primary">&times;</button>
          <h2 className="text-2xl font-bold mb-6">Buy Crypto</h2>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 mb-8">
            <h4 className="flex items-center gap-2 text-primary font-bold mb-4">
              <i className="fas fa-info-circle"></i> Send Payment To:
            </h4>
            <div className="space-y-2 text-sm">
              {paymentMethods.map(m => (
                <div key={m.id} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                  <span>{m.name}</span>
                  <strong className="font-mono text-primary">{m.number}</strong>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500 italic">Send money with transaction cost included. Take a screenshot after payment.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm text-slate-400">Crypto Type</label>
                <select className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none">
                  <option value="USDT">USDT (Tether)</option>
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="BNB">BNB</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-400">Amount (USD)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none"
                  placeholder="100"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-slate-400">Payment Method</label>
              <select className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none">
                {paymentMethods.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-slate-400">Your Sender Number</label>
              <input 
                type="tel" 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none"
                placeholder="01XXXXXXXXX"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-slate-400">Transaction ID</label>
              <input 
                type="text" 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none font-mono"
                placeholder="TRX123456"
                required
              />
            </div>

            <button className="w-full bg-primary hover:bg-blue-600 py-4 rounded-xl font-bold transition shadow-lg mt-6">
              Submit Buy Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuyModal;
