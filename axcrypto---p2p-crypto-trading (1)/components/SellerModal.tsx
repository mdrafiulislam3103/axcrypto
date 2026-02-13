
import React from 'react';

interface SellerModalProps {
  onClose: () => void;
  showNotification: (msg: string) => void;
}

const SellerModal: React.FC<SellerModalProps> = ({ onClose, showNotification }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification("Seller application submitted! We will contact you on WhatsApp.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card w-full max-w-lg rounded-2xl border border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-8 relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-2xl hover:text-primary">&times;</button>
          <h2 className="text-2xl font-bold mb-4">Seller Application</h2>
          
          <div className="bg-accent/10 p-6 rounded-2xl border border-accent/20 mb-8">
            <h4 className="flex items-center gap-2 text-accent font-bold mb-2">
              <i className="fas fa-exclamation-triangle"></i> Mandatory Requirements:
            </h4>
            <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
              <li>Security Deposit: 1.5 Lakh BDT (Refundable)</li>
              <li>Bank Blank Cheque & Statement required</li>
              <li>Valid Passport & NID verification</li>
              <li>WhatsApp Interview: 01865467486</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm text-slate-400">WhatsApp Number</label>
              <input 
                type="tel" 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none"
                placeholder="01865467486"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-slate-400">Bank Blank Cheque (Scan)</label>
              <input type="file" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs" required />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-slate-400">Passport / NID Copy</label>
              <input type="file" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs" required />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-slate-400">Bank Statement (Last Month)</label>
              <input type="file" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs" required />
            </div>

            <div className="pt-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 w-5 h-5 rounded border-slate-800 bg-slate-900 text-primary focus:ring-primary" required />
                <span className="text-sm text-slate-400">
                  I understand that a 1.5 Lakh BDT security deposit is mandatory for seller verification.
                </span>
              </label>
            </div>

            <button className="w-full bg-primary hover:bg-blue-600 py-4 rounded-xl font-bold transition shadow-lg mt-6">
              Submit Seller Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerModal;
