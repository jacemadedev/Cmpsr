import { Command, Github, Twitter, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    product: [
      { label: 'Features', href: '#' },
      { label: 'Documentation', href: '#' },
      { label: 'Pricing', href: '#' },
      { label: 'Changelog', href: '#' },
    ],
    resources: [
      { label: 'Guide', href: '#' },
      { label: 'API Reference', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Community', href: '#' },
    ],
    company: [
      { label: 'About', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Partners', href: '#' },
    ],
    legal: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'License', href: '#' },
      { label: 'Security', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com' },
    { icon: Twitter, href: 'https://twitter.com' },
    { icon: Linkedin, href: 'https://linkedin.com' },
  ];

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-neutral-800 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Logo and Description */}
          <div className="col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20">
                <Command className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                Composer Kit
              </span>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              The ultimate React development kit with AI capabilities, authentication, payments, and
              beautiful UI components.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                {title}
              </h3>
              <ul className="mt-4 space-y-2">
                {items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-neutral-800">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} Composer Kit. All rights reserved.
            </p>
            <div className="flex items-center gap-8">
              <a
                href="#"
                className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
