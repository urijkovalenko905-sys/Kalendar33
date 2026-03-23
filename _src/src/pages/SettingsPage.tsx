import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Moon, Sun, Bell, Volume2, Globe, Trash2, Info, Share2 } from 'lucide-react';
import { useTelegram } from '../telegram/useTelegram';

export const SettingsPage: React.FC = () => {
  const { haptic, shareApp } = useTelegram();
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('system');
  const [sounds, setSounds] = useState(true);
  const [notifications, setNotifications] = useState(false);

  const handleThemeChange = (newTheme: 'dark' | 'light' | 'system') => {
    haptic.light();
    setTheme(newTheme);
    // Apply theme logic here
  };

  const toggleSounds = () => {
    haptic.light();
    setSounds(!sounds);
  };

  const toggleNotifications = () => {
    haptic.light();
    setNotifications(!notifications);
  };

  const clearCache = () => {
    haptic.medium();
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-6 pt-4 pb-24">
      <h1 className="text-h1 text-white text-center mb-4">Настройки</h1>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex flex-col gap-6">
        
        {/* Theme */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80">
              <Moon size={18} />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Тема оформления</h3>
          </div>
          <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
            {['dark', 'system', 'light'].map((t) => (
              <button
                key={t}
                onClick={() => handleThemeChange(t as any)}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${theme === t ? 'bg-white/20 text-white shadow-sm' : 'text-white/50 hover:text-white/80'}`}
              >
                {t === 'dark' ? 'Тёмная' : t === 'light' ? 'Светлая' : 'Системная'}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-white/10" />

        {/* Toggles */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80">
                <Volume2 size={18} />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Звуки и вибрация</h3>
            </div>
            <button 
              onClick={toggleSounds}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${sounds ? 'bg-[var(--color-cta)]' : 'bg-white/20'}`}
            >
              <motion.div 
                className="w-4 h-4 rounded-full bg-white shadow-sm"
                animate={{ x: sounds ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80">
                <Bell size={18} />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Уведомления</h3>
            </div>
            <button 
              onClick={toggleNotifications}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications ? 'bg-[var(--color-cta)]' : 'bg-white/20'}`}
            >
              <motion.div 
                className="w-4 h-4 rounded-full bg-white shadow-sm"
                animate={{ x: notifications ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>

        <hr className="border-white/10" />

        {/* Language & Cache */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80">
                <Globe size={18} />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Язык контента</h3>
            </div>
            <span className="text-sm font-bold text-white/50">Русский</span>
          </div>

          <button 
            onClick={clearCache}
            className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors py-2"
          >
            <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
              <Trash2 size={18} />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest">Очистить кэш</h3>
          </button>
        </div>

        <hr className="border-white/10" />

        {/* About & Share */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => shareApp()}
            className="flex items-center gap-3 text-[var(--color-cta)] hover:text-[var(--color-cta)]/80 transition-colors py-2"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--color-cta)]/10 flex items-center justify-center">
              <Share2 size={18} />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest">Поделиться приложением</h3>
          </button>

          <div className="flex items-center gap-3 py-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80">
              <Info size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">О приложении</h3>
              <p className="text-xs text-white/50">Версия 1.0.0 • Весёлый Календарь</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
