
import React from 'react';
import { User, Transaction, CryptoPrice } from './types';

export const USD_TO_BDT_RATE = 130;

export const INITIAL_CRYPTO_PRICES: CryptoPrice[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 117926.99, change24h: 2.45 },
  { symbol: 'ETH', name: 'Ethereum', price: 3647.14, change24h: -0.59 },
  { symbol: 'BNB', name: 'BNB', price: 790.52, change24h: 4.25 },
  { symbol: 'USDT', name: 'Tether', price: 1.00, change24h: 0.01 },
];

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+880 1712345678',
    balance: 1250.50,
    status: 'Active',
    role: 'USER',
    memberSince: 'Jan 2024'
  },
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@axcrypto.com',
    phone: '+880 1865467486',
    balance: 99999.00,
    status: 'Active',
    role: 'ADMIN',
    memberSince: 'Dec 2023'
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'TX1001',
    userId: '1',
    userName: 'John Doe',
    date: '2024-03-20',
    type: 'Buy',
    crypto: 'USDT',
    amount: 500,
    status: 'Approved',
    paymentMethod: 'bKash',
    transactionId: 'TRX778899'
  },
  {
    id: 'TX1002',
    userId: '1',
    userName: 'John Doe',
    date: '2024-03-19',
    type: 'Withdraw',
    amount: 100,
    status: 'Pending',
    paymentMethod: 'Nagad'
  }
];

export const PAYMENT_METHODS = [
  { id: 'bkash', name: 'bKash', icon: <i className="fa-solid fa-mobile-screen-button"></i>, number: '01917142350' },
  { id: 'rocket', name: 'Rocket', icon: <i className="fa-solid fa-rocket"></i>, number: '01306755110' },
  { id: 'nagad', name: 'Nagad', icon: <i className="fa-solid fa-money-bill-wave"></i>, number: '01865467486' },
  { id: 'upay', name: 'Upay', icon: <i className="fa-solid fa-mobile-alt"></i>, number: '01865467486' },
];
