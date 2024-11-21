import { motion } from 'framer-motion';
import { Command, ArrowRight, GitBranch } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useNavigate } from '@/lib/navigate';
import { FeatureSection } from './FeatureSection';
import { TechStackSection } from './TechStackSection';
import { ProjectStructureSection } from './ProjectStructureSection';
import { DashboardPreview } from './DashboardPreview';
import { Footer } from './Footer';

export function HomePage() {
  const { user } = useAuth();
  const { navigate } = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Navigation */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-lg dark:border-neutral-800/50 dark:bg-black/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20">
                <Command className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                Composer Kit
              </span>
            </div>
            <div className="flex items-center gap-4">
              {!user && (
                <>
                  <button
                    onClick={() => navigate('signin')}
                    className="px-4 py-2 text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => navigate('signup')}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden px-4 pb-16 pt-32 sm:px-6 lg:px-8"
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-[10px] opacity-50">
            <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-3xl" />
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
          >
            <Command className="h-4 w-4" />
            Production-Ready React Boilerplate
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold leading-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl"
          >
            Ship AI-Powered Apps
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              In Record Time
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mx-auto mt-6 max-w-3xl text-xl text-gray-600 dark:text-gray-400"
          >
            The ultimate React boilerplate for bolt.new. Go from idea to production with authentication,
            payments, and AI capabilities—all pre-configured and ready to scale.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
          >
            <button
              onClick={() => navigate('signup')}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-white transition-colors hover:bg-blue-700"
            >
              Start Building Now
              <ArrowRight className="h-5 w-5" />
            </button>
            <a
              href="https://github.com/yourusername/composer-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-8 py-3 text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              <GitBranch className="h-5 w-5" />
              View on GitHub
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* Preview Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <DashboardPreview />
        </div>
      </motion.section>

      {/* Feature Section */}
      <FeatureSection />

      {/* Tech Stack Section */}
      <TechStackSection />

      {/* Project Structure Section */}
      <ProjectStructureSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}