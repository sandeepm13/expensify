import React from 'react';
import { LayoutDashboard, Receipt, CreditCard, Sun, Moon, Menu, X, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from '../hooks/useTheme';
import { Button } from './ui/common';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: SidebarProps) {
    const { theme, toggleTheme } = useTheme();

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'transactions', label: 'Transactions', icon: Receipt },
        { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
        { id: 'yearly', label: 'Yearly', icon: Calendar },
        /* { id: 'settings', label: 'Settings', icon: Settings }, // Future scope */
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={cn("fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity", isOpen ? "opacity-100" : "opacity-0 pointer-events-none")}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Container */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 glass-panel border-r transition-transform duration-300 transform lg:translate-x-0 bg-white/90 dark:bg-black/90",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full p-4">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">Expensify</h1>
                        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsOpen(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
                                    className={cn(
                                        "flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                                        activeTab === item.id
                                            ? "bg-primary/10 text-primary shadow-sm"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <Icon className={cn("mr-3 h-5 w-5", activeTab === item.id ? "text-primary" : "opacity-70")} />
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="pt-4 mt-auto border-t">
                        <button
                            onClick={toggleTheme}
                            className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                        >
                            {theme === 'dark' ? <Sun className="mr-3 h-5 w-5" /> : <Moon className="mr-3 h-5 w-5" />}
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
    const [activeTab, setActiveTab] = React.useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    // Simple tab router for now
    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child as any, { activeTab });
        }
        return child;
    });

    return (
        <div className="min-h-screen bg-background transition-colors duration-300">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="lg:pl-64 flex flex-col min-h-screen">
                <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-4 lg:hidden glass-panel border-b mb-4">
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                        <Menu className="h-6 w-6" />
                    </Button>
                    <span className="font-bold text-lg">Expensify</span>
                    <div className="w-6" /> {/* Spacer */}
                </header>

                <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
                        {childrenWithProps}
                    </div>
                </main>
            </div>
        </div>
    );
}
