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

    // 1. Subscriptions - Initialize empty
    const subs: Subscription[] = [];

    for (const sub of subs) {
        await db.put('subscriptions', sub);
    }

    // 2. Budgets - Initialize with 0 limits
    const budgets: Budget[] = [
        { category: 'Food', limit: 0 },
        { category: 'Travel', limit: 0 },
        { category: 'Subscriptions', limit: 0 },
        { category: 'Other', limit: 0 },
    ];

    for (const b of budgets) {
        await db.put('budgets', b);
    }

    // 3. Transactions - Initialize empty
    const transactions: Transaction[] = [];

    for (const tx of transactions) {
        await db.put('transactions', tx);
    }
}
