export type TransactionType = 'credit' | 'debit';
export type AccountType = 'savings' | 'current';
export type AccountTransactionType = 'duitnow' | 'bank';

export interface Transaction {
  id: string;
  amount: number;
  date: string; // ISO format
  description: string;
  type: TransactionType;
  transactionType: AccountTransactionType;
  referenceNo: number;
  accountType: AccountType;
  accountNumber: string;
  recepientAccountNumber?: string;
  recepientAccountType?: AccountType;
  mobileNumber?: string;
  recepientName: string;
}

export interface TransactionGroup {
  date: string;
  data: Transaction[];
}
