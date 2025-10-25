
import { useEffect } from 'react';

type ShortcutMap = {
  [key: string]: () => void;
};

export const useKeyboardShortcuts = (shortcuts: ShortcutMap) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore shortcuts if user is typing in an input, textarea, or select
      const target = event.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
      }

      const shortcut = shortcuts[event.key];
      if (shortcut) {
        event.preventDefault();
        shortcut();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
};
