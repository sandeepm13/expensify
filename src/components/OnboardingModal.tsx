import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from './ui/common';

export function OnboardingModal() {
    const { userName, setUserName } = useFinance();
    const [name, setName] = useState('');
    if (userName) return null; // Don't show if name is already set

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            setUserName(name.trim());
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-500">
            <Card className="w-full max-w-md relative animate-in zoom-in-95 duration-300 border-primary/20 shadow-2xl shadow-primary/10">
                <CardHeader className="text-center pb-2">

                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                        Welcome to Expensify!
                    </CardTitle>
                    <p className="text-muted-foreground mt-2">
                        Let's get to know you better. What should we call you?
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Input
                                placeholder="Enter your name..."
                                className="text-center text-lg h-12"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-12 text-lg font-bold bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-[1.02]"
                            disabled={!name.trim()}
                        >
                            Get Started
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
