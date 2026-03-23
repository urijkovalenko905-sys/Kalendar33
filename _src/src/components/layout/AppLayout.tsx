import React from 'react';
import { Header } from './Header';
import { TabBar } from './TabBar';
import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  children: React.ReactNode;
  activeNavTab: string;
  onNavTabChange: (id: string) => void;
  showHeaderAndTabs?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  activeNavTab, 
  onNavTabChange,
  showHeaderAndTabs = true 
}) => {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col pb-[72px]">
      {showHeaderAndTabs && (
        <div className="sticky top-0 z-30 bg-[var(--bg-base)]">
          <Header />
          <TabBar />
        </div>
      )}
      
      <main className="flex-1 overflow-y-auto no-scrollbar relative w-full max-w-md mx-auto px-4 py-6">
        {children}
      </main>
      
      <BottomNav activeTab={activeNavTab} onTabChange={onNavTabChange} />
    </div>
  );
};
