import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { useEffect } from 'react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      ) : (
        <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      )}
    </button>
  );
}
