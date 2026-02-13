
export type UserRole = 'PUBLIC' | 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
  status: 'Active' | 'Inactive' | 'Pending';
  role: UserRole;
  memberSince: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userName?: string;
  date: string;
  type: 'Buy' | 'Sell' | 'Withdraw' | 'Deposit' | 'Bonus' | 'Refund';
  crypto?: string;
  amount: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  details?: string;
  paymentMethod?: string;
  transactionId?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  number: string;
  icon: string;
}

export interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
}
