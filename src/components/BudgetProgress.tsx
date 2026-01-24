import { useMemo } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { Card, CardHeader, CardTitle, CardContent } from './ui/common';
import { formatCurrency, cn } from '../lib/utils';
import { isSameMonth, parseISO } from 'date-fns';

export function BudgetProgress() {
    const { budgets, transactions } = useFinance();

    const budgetStatus = useMemo(() => {
        const today = new Date();
        const currentMonthTx = transactions.filter(t =>
            t.type === 'expense' && isSameMonth(parseISO(t.date), today)
        );

        return budgets.map(b => {
            const spent = currentMonthTx
                .filter(t => t.category === b.category)
                .reduce((sum, t) => sum + t.amount, 0);

            const percentage = Math.min((spent / b.limit) * 100, 100);
            return { ...b, spent, percentage };
        });
    }, [budgets, transactions]);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Monthly Budget</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {budgetStatus.map((b) => {
                    let color = "bg-primary";
                    if (b.percentage >= 100) color = "bg-destructive";
                    else if (b.percentage >= 80) color = "bg-orange-500";
                    else if (b.category === "Food") color = "bg-emerald-500";
                    else if (b.category === "Travel") color = "bg-sky-500";
                    else if (b.category === "Subscriptions") color = "bg-purple-500";

                    return (
                        <div key={b.category} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">{b.category}</span>
                                <span className="text-muted-foreground">
                                    {formatCurrency(b.spent)} / {formatCurrency(b.limit)}
                                </span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <div
                                    className={cn("h-full transition-all duration-500 ease-out", color)}
                                    style={{ width: `${b.percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
