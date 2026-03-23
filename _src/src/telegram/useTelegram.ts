import WebApp from '@twa-dev/sdk';

export const MINI_APP_URL = 'https://urijkovalenko905-sys.github.io/Kalendar/';

export function useTelegram() {
  const tg = WebApp;

  const init = () => {
    tg.ready();
    tg.expand();
    tg.enableClosingConfirmation();
    tg.setHeaderColor('#0C0C1A');
    tg.setBackgroundColor('#0C0C1A');

    if (import.meta.env.PROD) {
      console.log('[Весёлый Календарь] Running at:', MINI_APP_URL);
      console.log('[Весёлый Календарь] Telegram user:', tg.initDataUnsafe?.user?.username);
    }
    
    const theme = tg.colorScheme ?? 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  };

  const shareApp = () => {
    const text = encodeURIComponent('📅 Открывай каждый день новые факты, мемы и истории!');
    const url  = encodeURIComponent(MINI_APP_URL);
    tg.openTelegramLink(`https://t.me/share/url?url=${url}&text=${text}`);
  };

  const haptic = {
    light:   () => tg.HapticFeedback.impactOccurred('light'),
    medium:  () => tg.HapticFeedback.impactOccurred('medium'),
    heavy:   () => tg.HapticFeedback.impactOccurred('heavy'),
    success: () => tg.HapticFeedback.notificationOccurred('success'),
    warning: () => tg.HapticFeedback.notificationOccurred('warning'),
    error:   () => tg.HapticFeedback.notificationOccurred('error'),
  };

  return { tg, init, haptic, shareApp };
}
