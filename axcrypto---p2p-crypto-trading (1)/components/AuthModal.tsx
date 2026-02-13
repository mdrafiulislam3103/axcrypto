
import React, { useState } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../constants';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'login') {
      // Simulate login
      const user = MOCK_USERS.find(u => u.email === formData.email || u.phone === formData.email) || MOCK_USERS[0];
      onSuccess(user);
    } else {
      // Simulate registration
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        balance: 0,
        status: 'Active',
        role: 'USER',
        memberSince: 'Mar 2024'
      };
      onSuccess(newUser);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card w-full max-w-md rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-2xl hover:text-primary">&times;</button>
          <h2 className="text-2xl font-bold mb-6">Welcome to axcrypto</h2>

          <div className="flex bg-slate-900 p-1 rounded-xl mb-6">
            <button 
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 rounded-lg font-bold transition ${activeTab === 'login' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 rounded-lg font-bold transition ${activeTab === 'register' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'register' && (
              <div className="space-y-1">
                <label className="text-sm text-slate-400">Full Name</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition"
                  placeholder="Enter full name"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-sm text-slate-400">{activeTab === 'login' ? 'Email or Phone' : 'Email Address'}</label>
              <input 
                type="text" 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition"
                placeholder={activeTab === 'login' ? "Enter email or phone" : "Enter email"}
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            {activeTab === 'register' && (
              <div className="space-y-1">
                <label className="text-sm text-slate-400">Phone Number</label>
                <input 
                  type="tel" 
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition"
                  placeholder="01XXXXXXXXX"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-sm text-slate-400">Password</label>
              <input 
                type="password" 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition"
                placeholder="Enter password"
                required
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <button className="w-full bg-primary hover:bg-blue-600 py-4 rounded-xl font-bold transition shadow-lg shadow-primary/20 mt-4">
              {activeTab === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center text-slate-500 text-sm">
            {activeTab === 'login' ? (
              <p>Forgot password? <a href="#" className="text-primary hover:underline">Reset here</a></p>
            ) : (
              <p>By registering, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
