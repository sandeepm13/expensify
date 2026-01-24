import { useMemo } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { getYear, parseISO } from 'date-fns';
import { SummaryCards } from './Summary';
import { DashboardCharts } from './DashboardCharts';
import { TransactionList } from './TransactionList';
import { BudgetProgress } from './BudgetProgress';
import { Button } from './ui/common';
import { Plus } from 'lucide-react';

export function Dashboard({ onAddClick }: { onAddClick: () => void }) {
    const { transactions, userName } = useFinance();

    const currentYearTransactions = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return transactions.filter(t => getYear(parseISO(t.date)) === currentYear);
    }, [transactions]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
                        Welcome back, {userName || 'Guest'}
                    </h1>
                </div>
                <Button onClick={onAddClick} className="shadow-lg shadow-primary/25 shrink-0">
                    <Plus className="mr-2 h-4 w-4" /> Add Transaction
                </Button>
            </div>

            <SummaryCards transactions={currentYearTransactions} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <DashboardCharts transactions={currentYearTransactions} />
                </div>
                <div className="lg:col-span-1">
                    <BudgetProgress />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <TransactionList limit={5} transactions={currentYearTransactions} />
            </div>
        </div>
    );
}
