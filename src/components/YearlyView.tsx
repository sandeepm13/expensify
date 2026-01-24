import { useState, useMemo } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { getYear, parseISO } from 'date-fns';
import { SummaryCards } from './Summary';
import { DashboardCharts } from './DashboardCharts';
import { TransactionList } from './TransactionList';
import { Button, Card, CardContent } from './ui/common';
import { ArrowLeft, Calendar } from 'lucide-react';

export function YearlyView() {
    const { transactions } = useFinance();
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    const availableYears = useMemo(() => {
        const years = transactions.map(t => getYear(parseISO(t.date)));
        return Array.from(new Set(years)).sort((a, b) => b - a);
    }, [transactions]);

    const yearTransactions = useMemo(() => {
        if (!selectedYear) return [];
        return transactions.filter(t => getYear(parseISO(t.date)) === selectedYear);
    }, [transactions, selectedYear]);

    if (selectedYear) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" onClick={() => setSelectedYear(null)}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Years
                    </Button>
                    <h2 className="text-3xl font-bold tracking-tight">{selectedYear} Overview</h2>
                </div>

                <SummaryCards transactions={yearTransactions} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <DashboardCharts transactions={yearTransactions} />
                    <TransactionList transactions={yearTransactions} />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Yearly Archives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableYears.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                        No transaction history available.
                    </div>
                ) : (
                    availableYears.map(year => (
                        <Card
                            key={year}
                            className="hover:scale-105 transition-transform duration-200 cursor-pointer bg-gradient-to-br from-white/40 to-white/10 dark:from-white/5 dark:to-transparent border-white/20 hover:border-primary/50"
                            onClick={() => setSelectedYear(year)}
                        >
                            <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                                <div className="p-4 rounded-full bg-primary/10 text-primary">
                                    <Calendar className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-bold">{year}</h3>
                                <p className="text-muted-foreground text-sm">
                                    {transactions.filter(t => getYear(parseISO(t.date)) === year).length} Transactions
                                </p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
