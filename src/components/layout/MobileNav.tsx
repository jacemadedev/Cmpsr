import { Menu } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { Page } from '@/lib/navigate';

interface MobileNavProps {
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

export function MobileNav({ onNavigate, currentPage }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6 text-gray-600" />
      </button>

      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-200 ease-in-out md:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Sidebar
          onClose={() => setIsOpen(false)}
          onNavigate={onNavigate}
          currentPage={currentPage}
        />
      </div>
    </>
  );
}