import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { useFinance } from '../contexts/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/common';
import { formatCurrency } from '../lib/utils';
import { subMonths, format, parseISO, isSameMonth } from 'date-fns';

const COLORS = {
    Food: '#10B981',        // Emerald
    Travel: '#0EA5E9',      // Sky Blue
    Subscriptions: '#8B5CF6', // Purple
    Other: '#F59E0B',       // Amber
    Income: '#22c55e'
};



import type { Transaction } from '../types';

export function DashboardCharts({ transactions: propTransactions }: { transactions?: Transaction[] }) {
    const { transactions: contextTransactions } = useFinance();
    const transactions = propTransactions || contextTransactions;

    // 1. Expense Breakdown (This Month)
    const expenseBreakdown = useMemo(() => {
        const today = new Date();
        const currentMonthTx = transactions.filter(t =>
            t.type === 'expense' && isSameMonth(parseISO(t.date), today)
        );

        const byCategory = currentMonthTx.reduce((acc, t) => {
            const cat = t.category as keyof typeof COLORS || 'Other';
            acc[cat] = (acc[cat] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(byCategory).map(([name, value]) => ({ name, value }));
    }, [transactions]);

    // 2. Spending Trends (Last 6 Months)
    const spendingTrends = useMemo(() => {
        const data: any[] = [];
        const today = new Date();

        for (let i = 5; i >= 0; i--) {
            const date = subMonths(today, i);
            const monthLabel = format(date, 'MMM');

            const monthTx = transactions.filter(t =>
                t.type === 'expense' && isSameMonth(parseISO(t.date), date)
            );

            const monthData: any = { name: monthLabel };
            // Initialize categories
            ['Food', 'Travel', 'Subscriptions', 'Other'].forEach(c => monthData[c] = 0);

            monthTx.forEach(t => {
                const cat = t.category || 'Other';
                if (monthData[cat] !== undefined) {
                    monthData[cat] += t.amount;
                } else {
                    // Fallback for custom categories if we had them
                    monthData['Other'] += t.amount;
                }
            });
            data.push(monthData);
        }
        return data;
    }, [transactions]);

    if (transactions.length === 0) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <Card className="min-h-[400px]">
                <CardHeader>
                    <CardTitle>Expense Breakdown (This Month)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expenseBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {expenseBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.Other} />
                                    ))}
                                </Pie>
                                <ReTooltip formatter={(value: any) => formatCurrency(value)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card className="min-h-[400px]">
                <CardHeader>
                    <CardTitle>Spending Trends (Last 6 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={spendingTrends}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                                <ReTooltip formatter={(value: any) => formatCurrency(value)} />
                                <Legend />
                                <Bar dataKey="Food" stackId="a" fill={COLORS.Food} radius={[0, 0, 4, 4]} />
                                <Bar dataKey="Travel" stackId="a" fill={COLORS.Travel} />
                                <Bar dataKey="Subscriptions" stackId="a" fill={COLORS.Subscriptions} />
                                <Bar dataKey="Other" stackId="a" fill={COLORS.Other} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
