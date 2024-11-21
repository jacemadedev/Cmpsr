import { useState } from 'react';
import { X, User, Key, LogOut, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useStore } from '@/lib/store';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'api-keys'>('profile');
  const { user, signOut } = useAuth();
  const { apiKey, setApiKey } = useStore();
  const [newApiKey, setNewApiKey] = useState(apiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const handleSaveApiKey = () => {
    setApiKey(newApiKey || null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDisconnect = () => {
    setApiKey(null);
    setNewApiKey('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 p-4 dark:border-gray-800">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm ${
                  activeTab === 'profile'
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <User className="h-5 w-5" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('api-keys')}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm ${
                  activeTab === 'api-keys'
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <Key className="h-5 w-5" />
                API Keys
              </button>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-5 w-5" />
                Sign out
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto p-6">
            {activeTab === 'profile' ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage your account settings
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      readOnly
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Time Zone
                    </label>
                    <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                      <option>UTC (GMT +00:00)</option>
                      <option>EST (GMT -05:00)</option>
                      <option>PST (GMT -08:00)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">API Keys</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage your API keys for different services
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      OpenAI API Key
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={newApiKey}
                        onChange={(e) => setNewApiKey(e.target.value)}
                        placeholder="Enter your OpenAI API key (optional)"
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
                      />
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {apiKey
                        ? 'Using your custom API key'
                        : 'Using default API key. Add your own key for custom usage limits.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <button
                      onClick={handleSaveApiKey}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                    >
                      Save API Key
                    </button>
                    {saveSuccess && (
                      <span className="text-sm text-green-600 dark:text-green-400">
                        Settings updated successfully!
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 dark:border-gray-800">
                  <h4 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
                    Connected Services
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                          <svg
                            className="h-6 w-6 text-green-600 dark:text-green-400"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">OpenAI</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {apiKey ? 'Using custom API key' : 'Using default API key'}
                          </p>
                        </div>
                      </div>
                      {apiKey && (
                        <button
                          onClick={handleDisconnect}
                          className="rounded-lg px-3 py-1 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          Reset to Default
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
