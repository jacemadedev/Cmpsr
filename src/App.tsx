import { useEffect, useState, Suspense } from 'react';
import { SignInForm } from './components/auth/SignInForm';
import { SignUpForm } from './components/auth/SignUpForm';
import { Dashboard } from './components/dashboard/Dashboard';
import { ChatPage } from './components/chat/ChatPage';
import { HistoryPage } from './components/history/HistoryPage';
import { ReposPage } from './components/repos/ReposPage';
import { HomePage } from './components/home/HomePage';
import { useAuth } from './lib/auth';
import { supabase } from './lib/supabase';
import { useNavigate } from './lib/navigate';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingScreen } from './components/LoadingScreen';

export default function App() {
  const { currentPage } = useNavigate();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  if (loading) {
    return <LoadingScreen />;
  }

  // Render the appropriate page based on navigation and auth state
  const renderPage = () => {
    // If not authenticated, show auth pages or homepage
    if (!user) {
      switch (currentPage) {
        case 'signin':
          return <SignInForm />;
        case 'signup':
          return <SignUpForm />;
        default:
          return <HomePage />;
      }
    }

    // If authenticated, show app pages
    switch (currentPage) {
      case 'chat':
        return <ChatPage />;
      case 'history':
        return <HistoryPage />;
      case 'repos':
        return <ReposPage />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>{renderPage()}</Suspense>
    </ErrorBoundary>
  );
}