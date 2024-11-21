import { motion } from 'framer-motion';
import { FolderTree } from 'lucide-react';

const projectStructure = `project-root/
├── src/
│ ├── components/
│ │ ├── ui/ # shadcn/ui components
│ │ ├── payment/ # Stripe-related components
│ │ └── layout/ # Layout components
│ ├── lib/
│ │ ├── utils.ts # Utility functions
│ │ ├── auth.ts # Authentication helpers
│ │ ├── stripe.ts # Stripe helpers
│ │ └── config.ts # App configuration
│ └── pages/ # Route pages
├── netlify/
│ └── functions/ # Serverless functions
└── public/ # Static assets`;

export function ProjectStructureSection() {
  return (
    <section className="bg-white py-24 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
          >
            <FolderTree className="h-4 w-4" />
            Clean & Organized
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            Project Structure
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-gray-600 dark:text-gray-400"
          >
            Well-organized file structure for scalability and maintainability
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-auto rounded-2xl bg-gray-50 p-8 dark:bg-neutral-900"
        >
          <pre className="whitespace-pre font-mono text-sm text-gray-900 dark:text-white">
            {projectStructure}
          </pre>
        </motion.div>
      </div>
    </section>
  );
}
