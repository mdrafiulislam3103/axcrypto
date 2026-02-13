
import React, { useState } from 'react';
import { User, Transaction, PaymentMethod } from '../types';

interface AdminDashboardProps {
  admin: User;
  allTransactions: Transaction[];
  allUsers: User[];
  paymentMethods: PaymentMethod[];
  onUpdateTransactions: (txs: Transaction[]) => void;
  onUpdateUsers: (users: User[]) => void;
  onUpdatePayments: (methods: PaymentMethod[]) => void;
  onLogout: () => void;
  showNotification: (msg: string, type?: 'success' | 'error') => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  admin, 
  allTransactions, 
  allUsers, 
  paymentMethods,
  onUpdateTransactions, 
  onUpdateUsers, 
  onUpdatePayments,
  onLogout,
  showNotification 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [creditModal, setCreditModal] = useState<{ isOpen: boolean; userId: string }>({ isOpen: false, userId: '' });
  const [creditAmount, setCreditAmount] = useState<string>('');

  const handleUpdatePayment = (id: string, newNumber: string) => {
    const updated = paymentMethods.map(m => m.id === id ? { ...m, number: newNumber } : m);
    onUpdatePayments(updated);
    showNotification("Payment number updated successfully");
  };

  const handleCreditUser = () => {
    const amountNum = parseFloat(creditAmount);
    if (isNaN(amountNum)) return;

    const updatedUsers = allUsers.map(u => {
      if (u.id === creditModal.userId) {
        return { ...u, balance: u.balance + amountNum };
      }
      return u;
    });

    const newTx: Transaction = {
      id: `BONUS-${Date.now()}`,
      userId: creditModal.userId,
      userName: allUsers.find(u => u.id === creditModal.userId)?.name,
      date: new Date().toISOString().split('T')[0],
      type: 'Bonus',
      amount: amountNum,
      status: 'Approved',
      details: 'Admin Credit'
    };

    onUpdateUsers(updatedUsers);
    onUpdateTransactions([newTx, ...allTransactions]);
    showNotification(`Credited $${amountNum} to user wallet`);
    setCreditModal({ isOpen: false, userId: '' });
    setCreditAmount('');
  };

  const approveTx = (id: string) => {
    const targetTx = allTransactions.find(t => t.id === id);
    if (!targetTx) return;

    const updatedUsers = allUsers.map(u => {
      if (u.id === targetTx.userId) {
        if (targetTx.type === 'Buy' || targetTx.type === 'Deposit') {
          return { ...u, balance: u.balance + targetTx.amount };
        }
      }
      return u;
    });

    const newTxs = allTransactions.map(tx => tx.id === id ? { ...tx, status: 'Approved' as const } : tx);
    
    onUpdateUsers(updatedUsers);
    onUpdateTransactions(newTxs);
    showNotification("Transaction approved and balance updated");
    setSelectedTx(null);
  };

  const rejectTx = (id: string) => {
    const newTxs = allTransactions.map(tx => tx.id === id ? { ...tx, status: 'Rejected' as const } : tx);
    onUpdateTransactions(newTxs);
    showNotification("Transaction rejected", "error");
    setSelectedTx(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8 animate-fade-in">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card p-6 rounded-2xl border border-slate-800">
                  <div className="text-3xl font-bold mb-1 text-accent">{allTransactions.filter(t => t.status === 'Pending').length}</div>
                  <div className="text-slate-500 text-sm font-bold">Pending Requests</div>
                </div>
                <div className="bg-card p-6 rounded-2xl border border-slate-800 border-l-4 border-l-success">
                  <div className="text-3xl font-bold mb-1">${allTransactions.filter(t => t.status === 'Approved').reduce((a, b) => a + b.amount, 0).toLocaleString()}</div>
                  <div className="text-slate-500 text-sm font-bold">Total Volume (Appr)</div>
                </div>
                <div className="bg-card p-6 rounded-2xl border border-slate-800">
                  <div className="text-3xl font-bold mb-1 text-primary">{allUsers.length}</div>
                  <div className="text-slate-500 text-sm font-bold">Total Registered Users</div>
                </div>
                <div className="bg-card p-6 rounded-2xl border border-slate-800">
                  <div className="text-3xl font-bold mb-1 text-blue-400 font-mono">130.00</div>
                  <div className="text-slate-500 text-sm font-bold">Global BDT Rate</div>
                </div>
             </div>

             <div className="bg-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-800 bg-slate-900/30">
                   <h3 className="font-bold flex items-center gap-2">
                     <i className="fas fa-clock text-accent"></i> Action Required
                   </h3>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                     <thead className="bg-slate-900 text-slate-500 text-xs uppercase tracking-wider">
                       <tr>
                         <th className="px-6 py-4">User</th>
                         <th className="px-6 py-4">Type</th>
                         <th className="px-6 py-4">Amount</th>
                         <th className="px-6 py-4">Status</th>
                         <th className="px-6 py-4 text-right">Action</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-800">
                       {allTransactions.filter(t => t.status === 'Pending').map(tx => (
                         <tr key={tx.id} className="hover:bg-slate-800/30 transition">
                           <td className="px-6 py-4">
                             <div className="font-bold">{tx.userName}</div>
                             <div className="text-xs text-slate-500 font-mono">{tx.userId}</div>
                           </td>
                           <td className="px-6 py-4">
                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tx.type === 'Buy' ? 'bg-primary/20 text-primary' : 'bg-orange-500/20 text-orange-400'}`}>
                               {tx.type}
                             </span>
                           </td>
                           <td className="px-6 py-4 font-mono font-bold text-success">${tx.amount}</td>
                           <td className="px-6 py-4">
                             <span className="flex items-center gap-1.5 text-accent text-xs font-bold animate-pulse">
                               <span className="w-2 h-2 bg-accent rounded-full"></span>
                               PENDING
                             </span>
                           </td>
                           <td className="px-6 py-4 text-right">
                             <button onClick={() => setSelectedTx(tx)} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition">
                               Process Request
                             </button>
                           </td>
                         </tr>
                       ))}
                       {allTransactions.filter(t => t.status === 'Pending').length === 0 && (
                         <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">All caught up! No pending requests.</td></tr>
                       )}
                     </tbody>
                   </table>
                </div>
             </div>
          </div>
        );
      case 'users':
        return (
          <div className="space-y-6 animate-fade-in">
             <div className="bg-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                   <h3 className="font-bold">Managed Users</h3>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-slate-900 text-slate-500 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Name</th>
                          <th className="px-6 py-4">Private Info</th>
                          <th className="px-6 py-4">Wallet</th>
                          <th className="px-6 py-4">Role</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {allUsers.map(user => (
                          <tr key={user.id} className="hover:bg-slate-800/20 transition">
                            <td className="px-6 py-4">
                               <div className="font-bold cursor-pointer hover:text-primary" onClick={() => setSelectedUser(user)}>{user.name}</div>
                               <div className="text-xs text-slate-500">ID: {user.id}</div>
                            </td>
                            <td className="px-6 py-4 text-sm">
                               <div className="flex items-center gap-2"><i className="fas fa-envelope text-slate-600 w-4"></i> {user.email}</div>
                               <div className="flex items-center gap-2"><i className="fas fa-phone text-slate-600 w-4"></i> {user.phone}</div>
                            </td>
                            <td className="px-6 py-4">
                               <div className="font-mono font-bold text-lg text-primary">${user.balance}</div>
                            </td>
                            <td className="px-6 py-4">
                               <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${user.role === 'ADMIN' ? 'bg-accent/20 text-accent' : 'bg-slate-700 text-slate-300'}`}>
                                 {user.role}
                               </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                               <div className="flex justify-end gap-2">
                                  <button 
                                    onClick={() => setCreditModal({ isOpen: true, userId: user.id })}
                                    className="bg-success/20 text-success hover:bg-success hover:text-white p-2 rounded-lg text-xs font-bold transition flex items-center gap-1"
                                    title="Add Funds"
                                  >
                                    <i className="fas fa-plus"></i> Credit
                                  </button>
                                  <button onClick={() => setSelectedUser(user)} className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-xs" title="View Details">
                                    <i className="fas fa-eye"></i>
                                  </button>
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        );
      case 'settings':
        return (
          <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
             <div className="bg-card p-8 rounded-2xl border border-slate-800 shadow-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                   <i className="fas fa-money-bill-transfer text-primary"></i> Payment Numbers
                </h3>
                <div className="space-y-6">
                   {paymentMethods.map(method => (
                     <div key={method.id} className="space-y-2">
                        <label className="text-xs text-slate-500 uppercase font-bold">{method.name} Number</label>
                        <div className="flex gap-2">
                           <input 
                              type="text" 
                              defaultValue={method.number}
                              id={`input-${method.id}`}
                              className="flex-grow bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-primary font-mono"
                           />
                           <button 
                             onClick={() => {
                               const val = (document.getElementById(`input-${method.id}`) as HTMLInputElement).value;
                               handleUpdatePayment(method.id, val);
                             }}
                             className="bg-primary hover:bg-blue-600 px-4 rounded-xl text-white transition"
                           >
                             Update
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-card p-8 rounded-2xl border border-slate-800 shadow-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                   <i className="fas fa-cog text-slate-400"></i> Platform Config
                </h3>
                <div className="space-y-4">
                   <div className="space-y-1">
                      <label className="text-xs text-slate-500 font-bold uppercase">USD TO BDT Rate</label>
                      <input type="number" defaultValue="130" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs text-slate-500 font-bold uppercase">Maintenance Mode</label>
                      <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
                         <span className="text-sm">Status: OFF</span>
                         <button className="ml-auto bg-slate-800 px-4 py-1 rounded text-xs">Toggle</button>
                      </div>
                   </div>
                   <button className="w-full bg-primary/20 text-primary border border-primary/30 py-4 rounded-xl font-bold mt-4 hover:bg-primary hover:text-white transition">
                      Save Global Settings
                   </button>
                </div>
             </div>
          </div>
        );
      default:
        return <div className="p-20 text-center text-slate-500 italic">Select a module from the sidebar.</div>;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-72 bg-card border-r border-slate-800 flex flex-col fixed h-screen z-40">
        <div className="p-8">
          <div className="text-2xl font-black text-accent tracking-tighter italic">AX-ADMIN</div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Control Console v2.1</div>
        </div>
        <nav className="flex-grow px-4 space-y-2">
          {[
            { id: 'overview', icon: 'fa-chart-pie', label: 'Dashboard' },
            { id: 'users', icon: 'fa-users-gear', label: 'User Management' },
            { id: 'settings', icon: 'fa-gears', label: 'Global Settings' },
            { id: 'logs', icon: 'fa-receipt', label: 'Audit Logs' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl font-bold transition ${
                activeTab === item.id ? 'bg-accent text-white shadow-xl shadow-accent/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <i className={`fas ${item.icon} w-6 text-center`}></i>
              {item.label}
              {item.id === 'overview' && allTransactions.filter(t => t.status === 'Pending').length > 0 && (
                <span className="ml-auto w-5 h-5 bg-danger text-[10px] flex items-center justify-center rounded-full text-white animate-bounce">
                  {allTransactions.filter(t => t.status === 'Pending').length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-6">
          <button onClick={onLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-xl font-bold text-danger bg-danger/5 hover:bg-danger hover:text-white transition">
            <i className="fas fa-power-off w-6 text-center"></i>
            Exit Console
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-grow ml-72 bg-background p-12 overflow-y-auto">
        <header className="flex items-center justify-between mb-12 bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
          <div>
             <h1 className="text-3xl font-black uppercase tracking-tight">{activeTab}</h1>
             <p className="text-slate-500 text-sm">Welcome back, {admin.name}</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <div className="font-black text-sm uppercase tracking-wider">{admin.name}</div>
                <div className="text-[10px] text-accent font-black uppercase">Root Administrator</div>
             </div>
             <div className="w-14 h-14 bg-accent/20 text-accent rounded-2xl flex items-center justify-center border border-accent/30 font-black text-xl shadow-lg">
               {admin.name.charAt(0)}
             </div>
          </div>
        </header>

        {renderContent()}
      </main>

      {/* Process Request Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/95 backdrop-blur-md animate-fade-in">
           <div className="bg-card w-full max-w-xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden p-8 border-t-8 border-t-accent">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black">VALIDATE TRANSACTION</h3>
                <button onClick={() => setSelectedTx(null)} className="text-3xl hover:text-danger transition">&times;</button>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="space-y-1 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                   <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Requester</span>
                   <div className="font-bold">{selectedTx.userName}</div>
                </div>
                <div className="space-y-1 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                   <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Requested Type</span>
                   <div className="font-bold text-primary">{selectedTx.type}</div>
                </div>
                <div className="space-y-1 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                   <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">USD Amount</span>
                   <div className="font-black text-2xl text-success">${selectedTx.amount}</div>
                </div>
                <div className="space-y-1 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                   <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Transaction ID</span>
                   <div className="font-mono text-sm text-slate-300">{selectedTx.transactionId || 'NOT_PROVIDED'}</div>
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 mb-8">
                 <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Proof of Payment</span>
                 <div className="mt-2 aspect-video bg-black/40 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-700">
                    <div className="text-center text-slate-600">
                       <i className="fas fa-image text-4xl mb-2"></i>
                       <p className="text-xs">User-uploaded screenshot preview</p>
                    </div>
                 </div>
              </div>

              <div className="flex gap-4">
                 <button onClick={() => approveTx(selectedTx.id)} className="flex-1 bg-success hover:bg-green-600 py-4 rounded-2xl font-black transition shadow-xl shadow-success/20">
                   APPROVE & CREDIT WALLET
                 </button>
                 <button onClick={() => rejectTx(selectedTx.id)} className="flex-1 bg-danger hover:bg-red-600 py-4 rounded-2xl font-black transition">
                   REJECT
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* User Details Modal (Private Info) */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/95 backdrop-blur-md animate-fade-in">
           <div className="bg-card w-full max-w-2xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden p-10">
              <div className="flex items-center gap-6 mb-10 border-b border-slate-800 pb-8">
                 <div className="w-24 h-24 bg-primary/20 text-primary text-4xl font-black rounded-3xl flex items-center justify-center border border-primary/30">
                   {selectedUser.name.charAt(0)}
                 </div>
                 <div className="flex-grow">
                    <h2 className="text-4xl font-black tracking-tight">{selectedUser.name}</h2>
                    <p className="text-slate-500 font-mono text-xs mt-1">UUID: {selectedUser.id}</p>
                    <div className="flex gap-2 mt-4">
                       <span className="bg-success/10 text-success text-[10px] font-black px-2 py-1 rounded border border-success/20">VERIFIED_IDENTITY</span>
                       <span className="bg-slate-800 text-slate-400 text-[10px] font-black px-2 py-1 rounded">USER_SINCE_{selectedUser.memberSince}</span>
                    </div>
                 </div>
                 <button onClick={() => setSelectedUser(null)} className="self-start text-4xl text-slate-600 hover:text-white transition">&times;</button>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-10">
                 <div>
                    <h4 className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4">Account Metadata</h4>
                    <div className="space-y-4">
                       <div>
                          <label className="text-xs text-slate-600 block">Email Address</label>
                          <div className="font-bold">{selectedUser.email}</div>
                       </div>
                       <div>
                          <label className="text-xs text-slate-600 block">Phone Connection</label>
                          <div className="font-bold">{selectedUser.phone}</div>
                       </div>
                    </div>
                 </div>
                 <div>
                    <h4 className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4">Financial Overview</h4>
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                       <label className="text-xs text-slate-600 block mb-1">Current Liquid Balance</label>
                       <div className="text-4xl font-black text-primary font-mono">${selectedUser.balance}</div>
                    </div>
                 </div>
              </div>

              <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                 <h4 className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4">Recent User Activity Logs</h4>
                 <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar">
                    {allTransactions.filter(t => t.userId === selectedUser.id).map(t => (
                      <div key={t.id} className="flex justify-between items-center text-sm p-3 bg-card rounded-xl border border-slate-800">
                         <span className="font-bold">{t.type} Request</span>
                         <span className="font-mono text-xs text-slate-500">{t.date}</span>
                         <span className={`font-black ${t.status === 'Approved' ? 'text-success' : 'text-danger'}`}>{t.status}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Credit Balance Modal */}
      {creditModal.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-card w-full max-w-sm rounded-3xl border border-slate-800 shadow-2xl p-8">
              <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Add Funds Manually</h3>
              <p className="text-slate-500 text-sm mb-6">User: {allUsers.find(u => u.id === creditModal.userId)?.name}</p>
              
              <div className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold uppercase">USD Amount to Credit</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-2xl font-black text-success focus:outline-none focus:border-success transition"
                      placeholder="0.00"
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(e.target.value)}
                    />
                 </div>
                 <div className="flex gap-3 pt-4">
                    <button onClick={handleCreditUser} className="flex-grow bg-success hover:bg-green-600 py-4 rounded-2xl font-black transition">
                       EXECUTE CREDIT
                    </button>
                    <button onClick={() => setCreditModal({ isOpen: false, userId: '' })} className="px-6 bg-slate-800 hover:bg-slate-700 py-4 rounded-2xl font-black transition">
                       CANCEL
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
