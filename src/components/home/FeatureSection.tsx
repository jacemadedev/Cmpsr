import { motion } from 'framer-motion';
import { Bot, Shield, Boxes, Workflow, Code2, Cpu } from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: 'AI Integration',
    description: 'Built-in OpenAI integration with token management and usage tracking',
  },
  {
    icon: Shield,
    title: 'Authentication',
    description: 'Secure auth system with Supabase, including social providers',
  },
  {
    icon: Boxes,
    title: 'Database & Storage',
    description: 'PostgreSQL database with Supabase real-time subscriptions',
  },
  {
    icon: Workflow,
    title: 'Payments',
    description: 'Stripe integration for subscriptions and usage-based billing',
  },
  {
    icon: Code2,
    title: 'Modern Stack',
    description: 'React 18, TypeScript, Vite, and Tailwind CSS for rapid development',
  },
  {
    icon: Cpu,
    title: 'Serverless Ready',
    description: 'Netlify Functions for backend operations and webhooks',
  },
];

export function FeatureSection() {
  return (
    <section className="bg-white py-24 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            Everything You Need
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-gray-600 dark:text-gray-400"
          >
            A complete toolkit for modern web development
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-6 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/20">
                <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
