import { useState, useMemo } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle, Input, Select, Button } from './ui/common';
import { formatCurrency, cn } from '../lib/utils';
import { format, parseISO } from 'date-fns';
import { Search, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

import type { Transaction } from '../types';

export function TransactionList({ limit, transactions: propTransactions }: { limit?: number, transactions?: Transaction[] }) {
    const { transactions: contextTransactions, deleteTransaction } = useFinance();
    const transactions = propTransactions || contextTransactions;
    const [filterCategory, setFilterCategory] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = useMemo(() => {
        let result = transactions;
        if (filterCategory !== 'All') {
            result = result.filter(t => t.category === filterCategory);
        }
        if (searchTerm) {
            result = result.filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return limit ? result.slice(0, limit) : result;
    }, [transactions, filterCategory, searchTerm, limit]);

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle>Recent Transactions</CardTitle>
                {!limit && (
                    <div className="flex space-x-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search..."
                                className="pl-8 w-[200px]"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select
                            className="w-[150px]"
                            value={filterCategory}
                            onChange={e => setFilterCategory(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            <option value="Food">Food</option>
                            <option value="Travel">Travel</option>
                            <option value="Subscriptions">Subscriptions</option>
                            <option value="Other">Other</option>
                        </Select>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {filtered.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">No transactions found.</div>
                    ) : (
                        filtered.map((t) => (
                            <div
                                key={t.id}
                                className="flex items-center justify-between p-4 rounded-xl bg-white/40 dark:bg-white/5 border border-white/10 hover:bg-white/60 dark:hover:bg-white/10 transition-colors group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={cn(
                                        "p-2 rounded-full",
                                        t.type === 'income' ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                                    )}>
                                        {t.type === 'income' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm leading-none">{t.description}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {t.category} • {format(parseISO(t.date), 'MMM dd, yyyy')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <span className={cn(
                                        "font-bold",
                                        t.type === 'income' ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                                    )}>
                                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-red-100/50"
                                        onClick={() => deleteTransaction(t.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
