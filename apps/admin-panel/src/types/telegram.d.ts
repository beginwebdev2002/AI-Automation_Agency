export {};

declare global {
  interface TelegramWebApp {
    ready: () => void;
    expand: () => void;
    initData: string;
    initDataUnsafe: {
      query_id?: string;
      user?: {
        id: number;
        first_name: string;
        last_name?: string;
        username?: string;
        language_code?: string;
        photo_url?: string;
      };
      auth_date?: string;
      hash?: string;
    };
    close: () => void;
    sendData: (data: string) => void;
    MainButton: {
      setText: (text: string) => void;
      show: () => void;
      hide: () => void;
      onClick: (callback: () => void) => void;
      offClick: (callback: () => void) => void;
      isVisible: boolean;
    };
    HapticFeedback: {
      impactOccurred: (
        style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft',
      ) => void;
      notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
      selectionChanged: () => void;
    };
  }

  interface Telegram {
    WebApp: TelegramWebApp;
  }

  interface Window {
    Telegram: Telegram;
  }

  const Telegram: Telegram;
}
