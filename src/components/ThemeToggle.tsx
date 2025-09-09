import React from 'react';
import { motion, AnimatePresence } from '@/lib/safe-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme, actualTheme } = useTheme();

  const themes = [
    { key: 'light' as const, icon: Sun, label: 'Light' },
    { key: 'dark' as const, icon: Moon, label: 'Dark' },
    { key: 'system' as const, icon: Monitor, label: 'System' },
  ];

  return (
    <div className="relative">
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {themes.map(({ key, icon: Icon, label }) => (
          <motion.button
            key={key}
            onClick={() => setTheme(key)}
            className={`
              relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200
              ${theme === key 
                ? 'text-white' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={label}
          >
            <AnimatePresence mode="wait">
              {theme === key && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-500 to-amber-500 rounded-lg"
                  layoutId="theme-indicator"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                />
              )}
            </AnimatePresence>
            <Icon className="relative z-10 w-4 h-4" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ThemeToggle;