export const MINI_APP_URL = 'https://urijkovalenko905-sys.github.io/Kalendar33/';

type ImpactLevel = 'light' | 'medium' | 'heavy';
type NotificationType = 'success' | 'warning' | 'error';

interface TelegramWebAppLike {
  ready?: () => void;
  expand?: () => void;
  enableClosingConfirmation?: () => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  openTelegramLink?: (url: string) => void;
  showAlert?: (message: string) => void;
  colorScheme?: 'light' | 'dark';
  initDataUnsafe?: {
    user?: {
      username?: string;
    };
  };
  HapticFeedback?: {
    impactOccurred?: (level: ImpactLevel) => void;
    notificationOccurred?: (type: NotificationType) => void;
  };
}

function getTelegramWebApp(): TelegramWebAppLike | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const telegramHost = (window as Window & { Telegram?: { WebApp?: TelegramWebAppLike } }).Telegram;
  return telegramHost?.WebApp ?? null;
}

export function useTelegram() {
  const tg = getTelegramWebApp();

  const init = () => {
    try {
      tg?.ready?.();
      tg?.expand?.();
      tg?.enableClosingConfirmation?.();
      tg?.setHeaderColor?.('#0C0C1A');
      tg?.setBackgroundColor?.('#0C0C1A');
    } catch {
      // Browser mode outside Telegram is expected.
    }

    if (import.meta.env.PROD) {
      console.log('[Весёлый Календарь] Running at:', MINI_APP_URL);
      console.log('[Весёлый Календарь] Telegram user:', tg?.initDataUnsafe?.user?.username);
    }

    const theme = tg?.colorScheme ?? 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  };

  const shareApp = () => {
    const text = encodeURIComponent('📅 Открывай каждый день новые факты, мемы и истории!');
    const url = encodeURIComponent(MINI_APP_URL);
    const shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;

    try {
      tg?.openTelegramLink?.(shareUrl);
      if (!tg?.openTelegramLink) {
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
      }
    } catch {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const haptic = {
    light: () => tg?.HapticFeedback?.impactOccurred?.('light'),
    medium: () => tg?.HapticFeedback?.impactOccurred?.('medium'),
    heavy: () => tg?.HapticFeedback?.impactOccurred?.('heavy'),
    success: () => tg?.HapticFeedback?.notificationOccurred?.('success'),
    warning: () => tg?.HapticFeedback?.notificationOccurred?.('warning'),
    error: () => tg?.HapticFeedback?.notificationOccurred?.('error'),
  };

  return { tg, init, haptic, shareApp };
}
