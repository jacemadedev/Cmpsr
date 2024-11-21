import { Command, Home, MessageSquare, Settings, X, History, Download } from 'lucide-react';
import { NavLink } from './NavLink';
import { ThemeToggle } from './ThemeToggle';
import { useState } from 'react';
import { SettingsModal } from '../settings/SettingsModal';
import { Page } from '@/lib/navigate';

interface SidebarProps {
  onClose?: () => void;
  currentPage?: Page;
  onNavigate?: (page: Page) => void;
}

export function Sidebar({ onClose, currentPage = 'dashboard', onNavigate }: SidebarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleNavigation = (page: Page) => {
    onNavigate?.(page);
    if (onClose) onClose();
  };

  return (
    <>
      <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-gray-200 bg-white dark:border-neutral-800 dark:bg-black">
        {/* Header */}
        <div className="flex-shrink-0 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20">
                <Command className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold leading-none text-gray-900 dark:text-white">
                  Composer Kit
                </h2>
                <span className="text-sm text-gray-500 dark:text-neutral-400">AI Assistant</span>
              </div>
            </div>
            {onClose && (
              <button
                className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-neutral-900 md:hidden"
                onClick={onClose}
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            <li>
              <NavLink
                onClick={() => handleNavigation('dashboard')}
                icon={<Home className="h-5 w-5" />}
                active={currentPage === 'dashboard'}
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={() => handleNavigation('chat')}
                icon={<MessageSquare className="h-5 w-5" />}
                active={currentPage === 'chat'}
              >
                Chat
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={() => handleNavigation('history')}
                icon={<History className="h-5 w-5" />}
                active={currentPage === 'history'}
              >
                History
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={() => handleNavigation('repos')}
                icon={<Download className="h-5 w-5" />}
                active={currentPage === 'repos'}
              >
                Repos
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-200 p-4 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <NavLink
              onClick={() => setIsSettingsOpen(true)}
              icon={<Settings className="h-5 w-5" />}
            >
              Settings
            </NavLink>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}