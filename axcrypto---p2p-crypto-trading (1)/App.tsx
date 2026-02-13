
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import { User, Transaction, CryptoPrice, PaymentMethod } from './types';
import { MOCK_USERS, MOCK_TRANSACTIONS, INITIAL_CRYPTO_PRICES, PAYMENT_METHODS } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [prices, setPrices] = useState<CryptoPrice[]>(INITIAL_CRYPTO_PRICES);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    PAYMENT_METHODS.map(m => ({ ...m, icon: 'fa-solid fa-money-bill' })) // Normalizing icon strings
  );
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    showNotification(`Welcome, ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showNotification("Logged out successfully");
  };

  return (
    <Router>
      <div className="min-h-screen bg-background text-slate-100 relative">
        {notification && (
          <div className={`fixed top-5 right-5 z-[100] px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in ${
            notification.type === 'success' ? 'bg-success' : notification.type === 'error' ? 'bg-danger' : 'bg-primary'
          }`}>
            <i className={`fas ${notification.type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}`}></i>
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        <Routes>
          <Route path="/" element={
            currentUser ? (
              currentUser.role === 'ADMIN' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />
            ) : (
              <PublicLayout 
                prices={prices} 
                paymentMethods={paymentMethods}
                onLogin={handleLogin} 
                showNotification={showNotification}
              />
            )
          } />
          
          <Route path="/dashboard/*" element={
            currentUser && currentUser.role === 'USER' ? (
              <UserDashboard 
                user={users.find(u => u.id === currentUser.id) || currentUser} 
                onLogout={handleLogout} 
                transactions={transactions.filter(t => t.userId === currentUser.id)}
                paymentMethods={paymentMethods}
                showNotification={showNotification}
              />
            ) : (
              <Navigate to="/" />
            )
          } />

          <Route path="/admin/*" element={
            currentUser && currentUser.role === 'ADMIN' ? (
              <AdminDashboard 
                admin={currentUser} 
                onLogout={handleLogout} 
                allTransactions={transactions}
                allUsers={users}
                paymentMethods={paymentMethods}
                onUpdateTransactions={setTransactions}
                onUpdateUsers={setUsers}
                onUpdatePayments={setPaymentMethods}
                showNotification={showNotification}
              />
            ) : (
              <Navigate to="/" />
            )
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
