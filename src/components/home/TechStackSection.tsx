import { motion } from 'framer-motion';

const techStack = [
  { name: 'React 18', description: 'Latest React features' },
  { name: 'TypeScript', description: 'Type-safe development' },
  { name: 'Vite', description: 'Lightning-fast builds' },
  { name: 'Tailwind CSS', description: 'Utility-first styling' },
  { name: 'shadcn/ui', description: 'Beautiful UI components' },
  { name: 'Supabase', description: 'Backend & Auth' },
  { name: 'Stripe', description: 'Payment processing' },
  { name: 'Netlify', description: 'Serverless deployment' },
];

export function TechStackSection() {
  return (
    <section className="bg-gray-50 py-24 dark:bg-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            Modern Tech Stack
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-gray-600 dark:text-gray-400"
          >
            Built with the latest and most reliable technologies
          </motion.p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-gray-100 bg-white p-6 text-center dark:border-neutral-800 dark:bg-black"
            >
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                {tech.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tech.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
