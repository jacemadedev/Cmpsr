import { DashboardLayout } from '../layout/DashboardLayout';
import { RepoCard } from './RepoCard';
import { motion } from 'framer-motion';

const repositories = [
  {
    name: 'composer-kit',
    description: 'A Vite boilerplate with Open AI, Stripe & Supabase',
    features: ['OpenAI Integration', 'Stripe Payments', 'Supabase Auth'],
    stars: 1337,
  },
  {
    name: 'composer-cut',
    description: 'A Vite + ffmpeg boilerplate for video editors',
    features: ['FFmpeg', 'Video Processing', 'Timeline Editor'],
    stars: 892,
  },
  {
    name: 'composer-studio',
    description: 'A Vite boilerplate to create logos with no background',
    features: ['OpenAI', 'Photoroom', 'Supabase'],
    stars: 654,
  },
];

export function ReposPage() {
  const handleLike = (repoName: string) => {
    console.log(`Liked ${repoName}`);
  };

  const handleFork = (repoName: string) => {
    console.log(`Forked ${repoName}`);
  };

  const handlePreview = (repoName: string) => {
    console.log(`Previewing ${repoName}`);
  };

  return (
    <DashboardLayout currentPage="repos">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">Repositories</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Fork and customize these starter templates for your projects
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {repositories.map((repo, index) => (
            <motion.div
              key={repo.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <RepoCard
                {...repo}
                onLike={() => handleLike(repo.name)}
                onFork={() => handleFork(repo.name)}
                onPreview={() => handlePreview(repo.name)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}