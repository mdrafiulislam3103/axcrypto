
import React, { useState } from 'react';
import { CryptoPrice, User, PaymentMethod } from '../types';
import { USD_TO_BDT_RATE } from '../constants';
import AuthModal from './AuthModal';
import BuyModal from './BuyModal';
import SellerModal from './SellerModal';

interface PublicLayoutProps {
  prices: CryptoPrice[];
  paymentMethods: PaymentMethod[];
  onLogin: (user: User) => void;
  showNotification: (msg: string, type?: 'success' | 'error') => void;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ prices, paymentMethods, onLogin, showNotification }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'login' | 'buy' | 'seller' | null>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary tracking-tight cursor-pointer" onClick={() => scrollToSection('home')}>
            axcrypto
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('home')} className="hover:text-primary transition">Home</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-primary transition">How It Works</button>
            <button onClick={() => scrollToSection('features')} className="hover:text-primary transition">Features</button>
            <button onClick={() => scrollToSection('seller')} className="hover:text-primary transition">Become Seller</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-primary transition">Contact</button>
            <button 
              onClick={() => setActiveModal('login')}
              className="bg-primary hover:bg-blue-600 px-5 py-2 rounded-full flex items-center gap-2 font-semibold transition"
            >
              <i className="fas fa-user"></i> Login / Register
            </button>
          </nav>

          <button className="md:hidden text-2xl" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-background pt-24 px-6 flex flex-col space-y-6 animate-fade-in md:hidden">
          <button onClick={() => scrollToSection('home')} className="text-xl text-left border-b border-slate-800 pb-2">Home</button>
          <button onClick={() => scrollToSection('how-it-works')} className="text-xl text-left border-b border-slate-800 pb-2">How It Works</button>
          <button onClick={() => scrollToSection('features')} className="text-xl text-left border-b border-slate-800 pb-2">Features</button>
          <button onClick={() => scrollToSection('seller')} className="text-xl text-left border-b border-slate-800 pb-2">Become Seller</button>
          <button onClick={() => scrollToSection('contact')} className="text-xl text-left border-b border-slate-800 pb-2">Contact</button>
          <button 
            onClick={() => { setActiveModal('login'); setIsMobileMenuOpen(false); }}
            className="w-full bg-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <i className="fas fa-user"></i> Login / Register
          </button>
        </div>
      )}

      <main className="flex-grow pt-20">
        <section id="home" className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-in">
            Buy & Sell Crypto <span className="text-primary">Instantly</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-lg mb-10">
            Secure P2P cryptocurrency trading platform. Buy and sell USDT, Bitcoin, and other cryptocurrencies with local payment methods in Bangladesh.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => setActiveModal('buy')}
              className="bg-primary hover:bg-blue-600 px-8 py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              <i className="fas fa-shopping-cart"></i> Buy Crypto Now
            </button>
            <button 
              onClick={() => scrollToSection('seller')}
              className="bg-slate-800 hover:bg-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2"
            >
              <i className="fas fa-user-tie"></i> Become a Seller
            </button>
          </div>
        </section>

        <section className="bg-slate-900/50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="bg-card p-8 rounded-2xl border border-slate-800 text-center shadow-xl">
                <h3 className="text-slate-400 uppercase tracking-widest text-sm font-bold mb-4">USD TO BDT RATE</h3>
                <div className="text-5xl font-extrabold text-primary mb-2">$1 = {USD_TO_BDT_RATE} TK</div>
                <div className="text-slate-500 text-sm flex items-center justify-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                   Updated: Just now • Admin controlled rate
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {prices.filter(p => p.symbol !== 'USDT').map(price => (
                  <div key={price.symbol} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex justify-between items-center hover:border-primary/50 transition cursor-default">
                    <div>
                      <div className="font-bold text-lg">{price.name} ({price.symbol})</div>
                      <div className={`text-sm ${price.change24h >= 0 ? 'text-success' : 'text-danger'}`}>
                        {price.change24h >= 0 ? '+' : ''}{price.change24h}% (24h)
                      </div>
                    </div>
                    <div className="text-xl font-mono font-bold">${price.price.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Accepted Payment Methods</h2>
            <p className="text-slate-400 mb-12">We support major mobile financial services in Bangladesh</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {paymentMethods.map(method => (
                <div key={method.id} className="bg-card p-8 rounded-2xl border border-slate-800 hover:border-primary/50 transition group shadow-lg">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-3xl text-primary mb-4 mx-auto group-hover:bg-primary group-hover:text-white transition">
                    <i className="fas fa-mobile-screen"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{method.name}</h3>
                  <p className="text-slate-500 text-sm mb-2">Instant Payments</p>
                  <div className="font-mono text-primary font-bold">{method.number}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 text-center container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Support</h2>
          <a 
            href="https://wa.me/8801865467486" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-success hover:bg-green-600 px-8 py-4 rounded-full font-bold text-lg transition shadow-xl shadow-success/20 mb-6"
          >
            <i className="fab fa-whatsapp text-2xl"></i> WhatsApp Support: 01865467486
          </a>
          <p className="text-slate-500">Email: support@axcrypto.com • Hours: 24/7 (GMT+6)</p>
        </section>
      </main>

      {/* Modals */}
      {activeModal === 'login' && (
        <AuthModal 
          onClose={() => setActiveModal(null)} 
          onSuccess={onLogin} 
        />
      )}
      {activeModal === 'buy' && (
        <BuyModal 
          onClose={() => setActiveModal(null)} 
          paymentMethods={paymentMethods}
          showNotification={showNotification}
        />
      )}
      {activeModal === 'seller' && (
        <SellerModal 
          onClose={() => setActiveModal(null)} 
          showNotification={showNotification}
        />
      )}
    </div>
  );
};

export default PublicLayout;
