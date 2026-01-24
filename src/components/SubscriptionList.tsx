import { useFinance } from '../contexts/FinanceContext';
import { Card, CardContent, Button } from './ui/common';
import { formatCurrency, cn } from '../lib/utils';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Calendar, Trash2, CheckCircle, XCircle } from 'lucide-react';

export function SubscriptionList() {
    const { subscriptions, deleteSubscription } = useFinance(); // Using deleteSubscription

    // Helper to check if renewal is soon (within 7 days)
    const isUpcoming = (dateStr: string) => {
        const days = differenceInDays(parseISO(dateStr), new Date());
        return days >= 0 && days <= 7;
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscriptions.map(sub => {
                    const upcoming = isUpcoming(sub.nextBillingDate);
                    return (
                        <Card key={sub.id} className={cn("relative overflow-hidden transition-all duration-300 hover:scale-[1.02]", upcoming ? "border-primary/50 ring-1 ring-primary/20" : "")}>
                            {upcoming && (
                                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl-lg font-medium z-10">
                                    Renewing Soon
                                </div>
                            )}
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        {sub.name.charAt(0)}
                                    </div>
                                    <div className="flex space-x-1">
                                        {/* Toggle Active (Mock functionality for UI) */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={sub.active ? "text-emerald-500" : "text-muted-foreground"}
                                            title={sub.active ? "Active" : "Inactive"}
                                        >
                                            {sub.active ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:bg-destructive/10"
                                            onClick={() => deleteSubscription(sub.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <h3 className="font-bold text-lg truncate mb-1">{sub.name}</h3>
                                <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    {formatCurrency(sub.cost)}
                                    <span className="text-sm text-muted-foreground font-normal ml-1">/{sub.billingPeriod === 'monthly' ? 'mo' : 'yr'}</span>
                                </p>

                                <div className="mt-6 flex items-center text-sm text-muted-foreground bg-secondary/50 p-2 rounded-lg">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    <span>Next: <span className={upcoming ? "text-primary font-bold" : ""}>{format(parseISO(sub.nextBillingDate), 'MMM dd, yyyy')}</span></span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
