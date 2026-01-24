import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Transaction, Subscription, Budget } from '../types';
import { initDB, getTransactions, getSubscriptions, getBudgets, getSetting, saveSetting, addTransaction as dbAddTx, deleteTransaction as dbDelTx, saveSubscription as dbSaveSub, deleteSubscription as dbDelSub } from '../lib/storage';

interface FinanceContextType {
    transactions: Transaction[];
    subscriptions: Subscription[];
    budgets: Budget[];
    userName: string | null;
    isLoading: boolean;
    setUserName: (name: string) => Promise<void>;
    addTransaction: (tx: Transaction) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
    addSubscription: (sub: Subscription) => Promise<void>;
    deleteSubscription: (id: string) => Promise<void>;
    refreshData: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [userName, setUserNameState] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const db = await initDB();
            const txs = await getTransactions(db);
            const subs = await getSubscriptions(db);
            const buds = await getBudgets(db);
            const name = await getSetting<string>(db, 'userName');

            // Sort transactions by date desc by default
            txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            setTransactions(txs);
            setSubscriptions(subs);
            setBudgets(buds);
            setUserNameState(name || null);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const setUserName = async (name: string) => {
        const db = await initDB();
        await saveSetting(db, 'userName', name);
        setUserNameState(name);
    };

    const addTransaction = async (tx: Transaction) => {
        const db = await initDB();
        await dbAddTx(db, tx);
        await loadData(); // Reload to ensure consistency
    };

    const deleteTransaction = async (id: string) => {
        const db = await initDB();
        await dbDelTx(db, id);
        await loadData();
    };

    const addSubscription = async (sub: Subscription) => {
        const db = await initDB();
        await dbSaveSub(db, sub);
        await loadData();
    };

    const deleteSubscription = async (id: string) => {
        const db = await initDB();
        await dbDelSub(db, id);
        await loadData();
    };

    return (
        <FinanceContext.Provider value={{ transactions, subscriptions, budgets, userName, isLoading, setUserName, addTransaction, deleteTransaction, addSubscription, deleteSubscription, refreshData: loadData }}>
            {children}
        </FinanceContext.Provider>
    );
}

export function useFinance() {
    const context = useContext(FinanceContext);
    if (context === undefined) {
        throw new Error('useFinance must be used within a FinanceProvider');
    }
    return context;
}
