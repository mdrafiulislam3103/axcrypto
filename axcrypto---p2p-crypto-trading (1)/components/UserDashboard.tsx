
import React, { useState } from 'react';
import { User, Transaction } from '../types';
import { PAYMENT_METHODS } from '../constants';

interface UserDashboardProps {
  user: User;
  transactions: Transaction[];
  onLogout: () => void;
  showNotification: (msg: string) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, transactions, onLogout, showNotification }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8 animate-fade-in">
             <div className="bg-card p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl">
                  <i className="fas fa-wallet"></i>
                </div>
                <div className="relative z-10">
                  <div className="text-slate-400 uppercase tracking-widest text-sm font-bold mb-2">Available Balance</div>
                  <div className="text-5xl font-extrabold mb-4">${user.balance.toLocaleString()}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">Account Status:</span>
                    <span className="px-3 py-1 bg-success/20 text-success text-xs font-bold rounded-full uppercase">Active</span>
                  </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { id: 'buy', icon: 'fa-shopping-cart', label: 'Buy Crypto', desc: 'Add funds to wallet' },
                  { id: 'sell', icon: 'fa-user-tie', label: 'Become Seller', desc: 'Apply for verification' },
                  { id: 'withdraw', icon: 'fa-arrow-up', label: 'Withdraw', desc: 'Cash out to bank/MFS' },
                  { id: 'history', icon: 'fa-history', label: 'History', desc: 'View all activity' }
                ].map(action => (
                  <button 
                    key={action.id}
                    onClick={() => setActiveTab(action.id)}
                    className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-primary transition text-left group"
                  >
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition">
                      <i className={`fas ${action.icon}`}></i>
                    </div>
                    <h4 className="font-bold">{action.label}</h4>
                    <p className="text-xs text-slate-500">{action.desc}</p>
                  </button>
                ))}
             </div>

             <div className="bg-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="font-bold">Recent Transactions</h3>
                  <button onClick={() => setActiveTab('history')} className="text-primary text-sm hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900/50 text-slate-500 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {transactions.slice(0, 5).map(tx => (
                        <tr key={tx.id} className="hover:bg-slate-800/30 transition">
                          <td className="px-6 py-4 text-sm">{tx.date}</td>
                          <td className="px-6 py-4">
                            <div className="font-bold">{tx.type}</div>
                            {tx.crypto && <div className="text-xs text-slate-500">{tx.crypto}</div>}
                          </td>
                          <td className="px-6 py-4 font-mono font-bold">${tx.amount}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                              tx.status === 'Approved' ? 'bg-success/20 text-success' : 
                              tx.status === 'Pending' ? 'bg-accent/20 text-accent' : 'bg-danger/20 text-danger'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {transactions.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-slate-500">No transactions found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
             </div>
          </div>
        );
      case 'buy':
        return (
          <div className="bg-card p-8 rounded-2xl border border-slate-800 max-w-2xl mx-auto animate-fade-in shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Buy Crypto</h2>
            <form onSubmit={(e) => { e.preventDefault(); showNotification("Request submitted!"); setActiveTab('overview'); }} className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-xs text-slate-500">Crypto</label>
                   <select className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none">
                     <option>USDT</option>
                     <option>BTC</option>
                     <option>ETH</option>
                   </select>
                 </div>
                 <div className="space-y-1">
                   <label className="text-xs text-slate-500">Amount (USD)</label>
                   <input type="number" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none" placeholder="Min 10" required />
                 </div>
               </div>
               <div className="space-y-1">
                   <label className="text-xs text-slate-500">Payment Method</label>
                   <select className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none">
                     {PAYMENT_METHODS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                   </select>
               </div>
               <div className="space-y-1">
                   <label className="text-xs text-slate-500">Transaction ID</label>
                   <input type="text" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none" placeholder="Paste TXID" required />
               </div>
               <button className="w-full bg-primary hover:bg-blue-600 py-4 rounded-xl font-bold transition shadow-lg mt-4">
                  Request Crypto Funding
               </button>
            </form>
          </div>
        );
      case 'withdraw':
        return (
          <div className="bg-card p-8 rounded-2xl border border-slate-800 max-w-2xl mx-auto animate-fade-in shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Withdraw Funds</h2>
            <div className="bg-slate-900 p-4 rounded-xl mb-6 text-sm flex justify-between">
              <span className="text-slate-400">Withdrawable Balance</span>
              <span className="font-bold text-primary">${user.balance}</span>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); showNotification("Withdrawal requested!"); setActiveTab('overview'); }} className="space-y-4">
               <div className="space-y-1">
                   <label className="text-xs text-slate-500">Amount (USD)</label>
                   <input type="number" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none" placeholder="Min 10" required />
               </div>
               <div className="space-y-1">
                   <label className="text-xs text-slate-500">Method</label>
                   <select className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none">
                     {PAYMENT_METHODS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                     <option value="bank">Bank Transfer</option>
                   </select>
               </div>
               <div className="space-y-1">
                   <label className="text-xs text-slate-500">Account Number</label>
                   <input type="text" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none" placeholder="01XXXXXXXXX" required />
               </div>
               <button className="w-full bg-primary hover:bg-blue-600 py-4 rounded-xl font-bold transition shadow-lg mt-4">
                  Confirm Withdrawal
               </button>
            </form>
          </div>
        );
      case 'history':
        return (
          <div className="bg-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl animate-fade-in">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-2xl font-bold">Transaction History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900/50 text-slate-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-6 py-4 text-xs font-mono">{tx.id}</td>
                      <td className="px-6 py-4 text-sm">{tx.date}</td>
                      <td className="px-6 py-4 font-bold">{tx.type}</td>
                      <td className="px-6 py-4 font-mono font-bold">${tx.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          tx.status === 'Approved' ? 'bg-success/20 text-success' : 
                          tx.status === 'Pending' ? 'bg-accent/20 text-accent' : 'bg-danger/20 text-danger'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">{tx.paymentMethod} {tx.transactionId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="bg-card p-8 rounded-2xl border border-slate-800 max-w-4xl mx-auto animate-fade-in shadow-xl">
            <div className="flex items-center gap-6 mb-12 border-b border-slate-800 pb-8">
              <div className="w-24 h-24 bg-primary text-white text-4xl font-bold rounded-full flex items-center justify-center">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-3xl font-bold">{user.name}</h2>
                <p className="text-slate-500">Member since: {user.memberSince}</p>
                <div className="mt-2 inline-flex px-3 py-1 bg-success/20 text-success text-xs font-bold rounded-full uppercase">Verified User</div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-4">
                 <h4 className="text-sm font-bold text-slate-500 uppercase">Contact Information</h4>
                 <div>
                    <label className="text-xs text-slate-400">Email Address</label>
                    <div className="font-semibold">{user.email}</div>
                 </div>
                 <div>
                    <label className="text-xs text-slate-400">Phone Number</label>
                    <div className="font-semibold">{user.phone}</div>
                 </div>
               </div>
               <div className="space-y-4">
                 <h4 className="text-sm font-bold text-slate-500 uppercase">Security Settings</h4>
                 <button className="w-full text-left p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-primary transition flex justify-between items-center">
                    <span>Change Password</span>
                    <i className="fas fa-chevron-right text-xs"></i>
                 </button>
                 <button className="w-full text-left p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-primary transition flex justify-between items-center">
                    <span>Enable Two-Factor Auth</span>
                    <i className="fas fa-toggle-off text-xl text-slate-600"></i>
                 </button>
               </div>
            </div>
          </div>
        );
      default:
        return <div>Section coming soon</div>;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-72 bg-card border-r border-slate-800 flex flex-col fixed h-screen z-40 hidden md:flex">
        <div className="p-8">
          <div className="text-2xl font-bold text-primary tracking-tight">MY WALLET</div>
        </div>
        <nav className="flex-grow px-4 space-y-2">
          {[
            { id: 'overview', icon: 'fa-tachometer-alt', label: 'Overview' },
            { id: 'buy', icon: 'fa-shopping-cart', label: 'Buy Crypto' },
            { id: 'sell', icon: 'fa-user-tie', label: 'Become Seller' },
            { id: 'withdraw', icon: 'fa-arrow-up', label: 'Withdraw Funds' },
            { id: 'history', icon: 'fa-history', label: 'Transaction History' },
            { id: 'profile', icon: 'fa-user', label: 'Profile' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl font-medium transition ${
                activeTab === item.id ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <i className={`fas ${item.icon} w-6 text-center`}></i>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-xl font-medium text-danger hover:bg-danger/10 transition"
          >
            <i className="fas fa-sign-out-alt w-6 text-center"></i>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-grow md:ml-72 bg-background p-6 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <h1 className="text-3xl font-bold capitalize">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <div className="bg-card px-6 py-3 rounded-xl border border-slate-800 flex items-center gap-4">
               <div className="text-xs text-slate-500 font-bold uppercase">Balance</div>
               <div className="text-xl font-mono font-bold">${user.balance}</div>
            </div>
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
               <i className="fas fa-bell"></i>
            </div>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

export default UserDashboard;
