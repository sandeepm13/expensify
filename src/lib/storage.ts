import type { DBSchema, IDBPDatabase } from 'idb';
import { openDB } from 'idb';
import type { Transaction, Subscription, Budget } from '../types';
// Used crypto.randomUUID() native API

interface ExpenseDB extends DBSchema {
    transactions: {
        key: string;
        value: Transaction;
        indexes: { 'by-date': string; 'by-category': string };
    };
    subscriptions: {
        key: string;
        value: Subscription;
    };
    budgets: {
        key: string;
        value: Budget;
    };
    settings: {
        key: string;
        value: any;
    };
}

const DB_NAME = 'ExpenseTrackerDB';

export async function initDB() {
    const db = await openDB<ExpenseDB>(DB_NAME, 2, {
        upgrade(db, oldVersion) {
            // Handle version 1 to 2 upgrade or initial creation
            if (oldVersion < 1) {
                const txStore = db.createObjectStore('transactions', { keyPath: 'id' });
                txStore.createIndex('by-date', 'date');
                txStore.createIndex('by-category', 'category');

                db.createObjectStore('subscriptions', { keyPath: 'id' });
                db.createObjectStore('budgets', { keyPath: 'category' });
            }
            if (oldVersion < 2) {
                // Check if object store exists to avoid error if it was somehow created
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }
            }
        },
    });

    // Check if seeding is needed
    const count = await db.count('transactions');
    if (count === 0) {
        await seedData(db);
    }

    return db;
}

export async function getTransactions(db: IDBPDatabase<ExpenseDB>) {
    return db.getAllFromIndex('transactions', 'by-date');
}

export async function addTransaction(db: IDBPDatabase<ExpenseDB>, tx: Transaction) {
    return db.put('transactions', tx);
}

export async function deleteTransaction(db: IDBPDatabase<ExpenseDB>, id: string) {
    return db.delete('transactions', id);
}

export async function getSubscriptions(db: IDBPDatabase<ExpenseDB>) {
    return db.getAll('subscriptions');
}

export async function saveSubscription(db: IDBPDatabase<ExpenseDB>, sub: Subscription) {
    return db.put('subscriptions', sub);
}

export async function deleteSubscription(db: IDBPDatabase<ExpenseDB>, id: string) {
    return db.delete('subscriptions', id);
}

export async function getBudgets(db: IDBPDatabase<ExpenseDB>) {
    return db.getAll('budgets');
}

export async function saveBudget(db: IDBPDatabase<ExpenseDB>, budget: Budget) {
    return db.put('budgets', budget);
}

export async function clearData() {
    const db = await openDB<ExpenseDB>(DB_NAME, 1);
    await db.clear('transactions');
    await db.clear('subscriptions');
    await db.clear('budgets');
    await seedData(db);
}

export async function getSetting<T>(db: IDBPDatabase<ExpenseDB>, key: string): Promise<T | undefined> {
    const result = await db.get('settings', key);
    return result ? result.value : undefined;
}

export async function saveSetting(db: IDBPDatabase<ExpenseDB>, key: string, value: any) {
    return db.put('settings', { key, value });
}

async function seedData(db: IDBPDatabase<ExpenseDB>) {
    console.log("Seeding data...");
    const today = new Date();

    // 1. Subscriptions
    const subs: Subscription[] = [
        { id: crypto.randomUUID(), name: 'Netflix Standard', cost: 499, billingPeriod: 'monthly', nextBillingDate: new Date(today.getFullYear(), today.getMonth(), 5).toISOString(), active: true },
        { id: crypto.randomUUID(), name: 'Amazon Prime', cost: 1499 / 12, billingPeriod: 'yearly', nextBillingDate: new Date(today.getFullYear(), today.getMonth(), 15).toISOString(), active: true },
        { id: crypto.randomUUID(), name: 'Spotify Premium', cost: 139, billingPeriod: 'monthly', nextBillingDate: new Date(today.getFullYear(), today.getMonth(), 21).toISOString(), active: true },
        { id: crypto.randomUUID(), name: 'Disney+ Hotstar', cost: 299, billingPeriod: 'monthly', nextBillingDate: new Date(today.getFullYear(), today.getMonth(), 10).toISOString(), active: true },
        { id: crypto.randomUUID(), name: 'YouTube Premium', cost: 149, billingPeriod: 'monthly', nextBillingDate: new Date(today.getFullYear(), today.getMonth(), 28).toISOString(), active: true },
        { id: crypto.randomUUID(), name: 'Gym Membership', cost: 1500, billingPeriod: 'monthly', nextBillingDate: new Date(today.getFullYear(), today.getMonth(), 1).toISOString(), active: true },
        { id: crypto.randomUUID(), name: 'Google One', cost: 130, billingPeriod: 'monthly', nextBillingDate: new Date(today.getFullYear(), today.getMonth(), 12).toISOString(), active: true },
    ];

    for (const sub of subs) {
        await db.put('subscriptions', sub);
    }

    // 2. Budgets
    const budgets: Budget[] = [
        { category: 'Food', limit: 15000 },
        { category: 'Travel', limit: 14000 },
        { category: 'Subscriptions', limit: 3500 },
        { category: 'Other', limit: 8000 },
    ];

    for (const b of budgets) {
        await db.put('budgets', b);
    }

    // 3. Transactions (Generate for last 3 months)
    const transactions: Transaction[] = [];

    for (let i = 0; i < 90; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString();

        // Income (1st of month: Salary, Random 15th: Freelance)
        if (date.getDate() === 1) {
            transactions.push({
                id: crypto.randomUUID(),
                type: 'income',
                category: 'Salary',
                amount: 38000,
                date: dateStr,
                description: 'Monthly Salary'
            });
        }
        if (date.getDate() === 15) {
            transactions.push({
                id: crypto.randomUUID(),
                type: 'income',
                category: 'Freelance',
                amount: 8000,
                date: dateStr,
                description: 'Freelance Project Payment'
            });
        }

        // Daily Expenses
        // Food
        if (Math.random() > 0.3) {
            const isDiningOut = Math.random() > 0.8;
            transactions.push({
                id: crypto.randomUUID(),
                type: 'expense',
                category: 'Food',
                amount: isDiningOut ? Math.floor(Math.random() * 500) + 300 : Math.floor(Math.random() * 200) + 50,
                date: dateStr,
                description: isDiningOut ? 'Restaurant Dinner' : 'Groceries/Snacks'
            });
        }

        // Travel
        if (Math.random() > 0.4) {
            const isCab = Math.random() > 0.7;
            transactions.push({
                id: crypto.randomUUID(),
                type: 'expense',
                category: 'Travel',
                amount: isCab ? Math.floor(Math.random() * 400) + 150 : Math.floor(Math.random() * 50) + 20,
                date: dateStr,
                description: isCab ? 'Uber/Ola Ride' : 'Metro/Bus'
            });
        }

        // Occasional 'Other'
        if (Math.random() > 0.85) {
            transactions.push({
                id: crypto.randomUUID(),
                type: 'expense',
                category: 'Other',
                amount: Math.floor(Math.random() * 2000) + 500,
                date: dateStr,
                description: 'Shopping/Misc'
            });
        }
    }

    for (const tx of transactions) {
        await db.put('transactions', tx);
    }
}
