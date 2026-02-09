import { format } from 'date-fns';
import { Transaction, TransactionType, TransactionGroup, AccountType } from '../models/transaction';

const DESCRIPTIONS: Record<string, string[]> = {
    Food: ['Whole Foods', 'Starbucks', 'Chipotle', 'Uber Eats', 'Blue Bottle Coffee'],
    Shopping: ['Amazon', 'Shopee', 'Lazada', 'Nike'],
    Transport: ['Grab', 'Shell', 'Petron', 'Caltex'],
    Entertainment: ['Netflix', 'Spotify', 'Disney+', 'Steam', 'Nintendo'],
    Bills: ['TM', 'Astro', 'Gym Membership', 'Rent'],
};

const RECIPIENT: { name: string; account: string; accountType?: AccountType, mobileNumber?: string }[] = [{ name: 'John Doe', account: '098712346666', accountType: 'savings', mobileNumber: '0123456789' }, { name: 'Jane Smith', account: '234551246890', accountType: 'current', mobileNumber: '0128904721' }, { name: 'Bob Johnson', account: '123456789012', accountType: 'savings', mobileNumber: '01194022212' }, { name: 'Alice Brown', account: '888313583214', accountType: 'current', mobileNumber: '01783490231' }, { name: 'Charlie Davis', account: '439013840124', accountType: 'savings', mobileNumber: '0169022212' }];

const CATEGORIES = Object.keys(DESCRIPTIONS);

const generateSingleTransaction = (index: number, dateOverride?: Date): Transaction => {
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const merchants = DESCRIPTIONS[category];
    const merchant = merchants[Math.floor(Math.random() * merchants.length)];
    const type: TransactionType = Math.random() > 0.8 ? 'credit' : 'debit';
    const amount = type === 'credit'
        ? Number((Math.random() * 2000 + 100).toFixed(2))
        : Number((Math.random() * 200 + 5).toFixed(2));

    let date: Date;
    if (dateOverride) {
        date = dateOverride;
    } else {
        const now = new Date().getTime();
        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
        const randomTime = now - Math.floor(Math.random() * thirtyDaysInMs);
        date = new Date(randomTime);
    }

    const account = Math.random() > 0.5
    const isBank = Math.random() > 0.5
    const recepient = RECIPIENT[Math.floor(Math.random() * RECIPIENT.length)];

    return {
        id: `tx-${index}-${Math.random().toString(36).slice(2, 9)}`,
        amount,
        date: date.toISOString(),
        description: merchant,
        type,
        transactionType: isBank ? 'bank' : 'duitnow',
        referenceNo: Math.floor(Math.random() * 1000000),
        accountType: account ? 'savings' : 'current',
        accountNumber: account ? '123456789999' : '987654321111',
        recepientAccountNumber: isBank ? recepient.account : undefined,
        recepientAccountType: isBank ? recepient.accountType : undefined,
        recepientName: recepient.name,
        mobileNumber: isBank ? undefined : recepient.mobileNumber
    };
};

const MOCK_TRANSACTIONS: Transaction[] = Array.from({ length: 25 }).map((_, i) =>
    generateSingleTransaction(i)
).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const groupTransactions = (transactions: Transaction[]): TransactionGroup[] => {
    const groups: Record<string, Transaction[]> = {};

    transactions.forEach(tx => {
        const date = format(new Date(tx.date), 'dd MMM yyyy');
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(tx);
    });

    return Object.entries(groups).map(([date, data]) => ({
        date,
        data: data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    })).sort((a, b) => new Date(b.data[0].date).getTime() - new Date(a.data[0].date).getTime());
};

export const transactionService = {
    getTransactions: async (): Promise<TransactionGroup[]> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate rare network error
        if (Math.random() < 0.05) {
            throw new Error('Failed to fetch transactions. Please try again.');
        }

        return groupTransactions(MOCK_TRANSACTIONS);
    },

    refreshTransactions: async (): Promise<TransactionGroup[]> => {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newTx = generateSingleTransaction(MOCK_TRANSACTIONS.length, new Date());
        MOCK_TRANSACTIONS.unshift(newTx);

        return groupTransactions(MOCK_TRANSACTIONS);
    },

    getTransactionById: async (id: string): Promise<Transaction | undefined> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_TRANSACTIONS.find(t => t.id === id);
    }
};
