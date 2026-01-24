import { useMemo } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { Card, CardContent } from './ui/common';
import { formatCurrency } from '../lib/utils';
import { isSameMonth, parseISO } from 'date-fns';
import { TrendingUp, Wallet, PiggyBank } from 'lucide-react';

import type { Transaction } from '../types';

export function SummaryCards({ transactions: propTransactions }: { transactions?: Transaction[] }) {
    const { transactions: contextTransactions } = useFinance();
    const transactions = propTransactions || contextTransactions;

    const stats = useMemo(() => {
        const today = new Date();
        const currentMonthTx = transactions.filter(t => isSameMonth(parseISO(t.date), today));

        const income = currentMonthTx
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = currentMonthTx
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const net = income - expenses;
        const savingsRate = income > 0 ? (net / income) * 100 : 0;

        return { income, expenses, net, savingsRate };
    }, [transactions]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Total Income</p>
                        <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(stats.income)}</h2>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <TrendingUp className="h-6 w-6" />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Total Expenses</p>
                        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(stats.expenses)}</h2>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                        <Wallet className="h-6 w-6" />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-sky-500/10 to-blue-600/5 border-sky-500/20">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Net Balance</p>
                        <h2 className="text-2xl font-bold text-sky-600 dark:text-sky-400">{formatCurrency(stats.net)}</h2>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400">
                        <PiggyBank className="h-6 w-6" />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-indigo-600/5 border-purple-500/20">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Savings Rate</p>
                        <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.savingsRate.toFixed(1)}%</h2>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <TrendingUp className="h-6 w-6" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
