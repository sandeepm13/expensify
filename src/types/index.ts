export type TransactionType = 'income' | 'expense';

export type Category = 'Food' | 'Travel' | 'Subscriptions' | 'Other';

export interface Transaction {
    id: string;
    type: TransactionType;
    category: Category | string; // Allow string for flexibility but UI will enforce types
    amount: number;
    date: string; // ISO date string
    description: string;
}

export interface Subscription {
    id: string;
    name: string;
    cost: number;
    billingPeriod: 'monthly' | 'yearly';
    nextBillingDate: string; // ISO date string
    active: boolean;
}

export interface Budget {
    category: Category;
    limit: number;
}

export interface AppSettings {
    currency: string;
    theme: 'light' | 'dark' | 'system';
}
