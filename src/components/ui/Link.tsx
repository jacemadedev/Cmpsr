import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface LinkProps {
  children: ReactNode;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export function Link({ icon, children, active, onClick }: LinkProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-gray-600 transition-all dark:text-neutral-400',
        'hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-neutral-900 dark:hover:text-blue-400',
        active && 'bg-blue-50 font-medium text-blue-600 dark:bg-neutral-900 dark:text-blue-400'
      )}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
