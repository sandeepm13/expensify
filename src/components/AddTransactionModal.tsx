import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { Button, Input, Select, Card, CardHeader, CardTitle, CardContent } from './ui/common';
import { X } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export function AddTransactionModal({ isOpen, onClose }: Props) {
    const { addTransaction } = useFinance();
    const [type, setType] = useState('expense');
    const [category, setCategory] = useState('Food');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addTransaction({
                id: crypto.randomUUID(),
                type: type as any,
                category,
                amount: parseFloat(amount),
                date: new Date(date).toISOString(),
                description
            });
            onClose(); // Close on success
            // Reset form
            setAmount('');
            setDescription('');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <Card className="w-full max-w-md relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
                <CardHeader>
                    <CardTitle>Add Transaction</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Type</label>
                                <div className="flex bg-secondary rounded-lg p-1">
                                    <button
                                        type="button"
                                        className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-all ${type === 'expense' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                        onClick={() => setType('expense')}
                                    >
                                        Expense
                                    </button>
                                    <button
                                        type="button"
                                        className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-all ${type === 'income' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                        onClick={() => setType('income')}
                                    >
                                        Income
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <Select value={category} onChange={e => setCategory(e.target.value)}>
                                    {type === 'expense' ? (
                                        <>
                                            <option value="Food">Food</option>
                                            <option value="Travel">Travel</option>
                                            <option value="Subscriptions">Subscriptions</option>
                                            <option value="Other">Other</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="Salary">Salary</option>
                                            <option value="Freelance">Freelance</option>
                                            <option value="Gift">Gift</option>
                                            <option value="Other">Other</option>
                                        </>
                                    )}
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Amount (₹)</label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                required
                                min="0"
                                step="0.01"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="text-lg font-bold"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date</label>
                            <Input
                                type="date"
                                required
                                value={date}
                                onChange={e => setDate(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Input
                                placeholder="What was this for?"
                                required
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>

                        <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                            Save Transaction
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
