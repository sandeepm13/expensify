import { useState } from 'react';
import { FinanceProvider } from './contexts/FinanceContext';
import { AppLayout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { TransactionList } from './components/TransactionList';
import { SubscriptionList } from './components/SubscriptionList';
import { OnboardingModal } from './components/OnboardingModal';
import { AddTransactionModal } from './components/AddTransactionModal';
import { Button } from './components/ui/common';
import { Plus } from 'lucide-react';

import { YearlyView } from './components/YearlyView';

function Content({ activeTab, onAddClick }: { activeTab?: string, onAddClick: () => void }) {
  if (activeTab === 'dashboard') {
    return <Dashboard onAddClick={onAddClick} />;
  }
  if (activeTab === 'transactions') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
        </div>
        <TransactionList />
      </div>
    );
  }
  if (activeTab === 'subscriptions') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Subscriptions</h2>
          {/* Add Subscription Button could go here, reusing AddTransaction or a new modal. For now, just display. */}
        </div>
        <SubscriptionList />
      </div>
    );
  }
  if (activeTab === 'yearly') {
    return <YearlyView />;
  }
  return null;
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <FinanceProvider>
      <AppLayout>
        <Content onAddClick={() => setIsModalOpen(true)} />
      </AppLayout>
      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <OnboardingModal />
    </FinanceProvider>
  );
}

export default App;
