import React, { useEffect, useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { TodayPage } from './pages/TodayPage';
import { SearchPage } from './pages/SearchPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { SettingsPage } from './pages/SettingsPage';
import { useTelegram } from './telegram/useTelegram';

export default function App() {
  const { init } = useTelegram();
  const [activeNavTab, setActiveNavTab] = useState('today');

  useEffect(() => {
    init();
  }, [init]);

  const renderPage = () => {
    switch (activeNavTab) {
      case 'today':
        return <TodayPage />;
      case 'search':
        return <SearchPage onDateSelect={() => setActiveNavTab('today')} />;
      case 'favorites':
        return <FavoritesPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <TodayPage />;
    }
  };

  return (
    <AppLayout 
      activeNavTab={activeNavTab} 
      onNavTabChange={setActiveNavTab}
      showHeaderAndTabs={activeNavTab === 'today'}
    >
      {renderPage()}
    </AppLayout>
  );
}
