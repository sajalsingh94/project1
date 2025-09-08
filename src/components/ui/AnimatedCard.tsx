import React from 'react';
import { motion, MotionProps } from 'framer-motion';

interface AnimatedCardProps extends Omit<MotionProps, 'children'> {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'neumorphism';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  variant = 'default',
  hover = true,
  className = '',
  onClick,
  ...motionProps
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg',
    glass: 'bg-white/10 dark:bg-gray-800/10 backdrop-blur-md border border-white/20 dark:border-gray-700/20',
    neumorphism: 'bg-gray-100 dark:bg-gray-800 shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] dark:shadow-[20px_20px_60px_#1a1a1a,-20px_-20px_60px_#2a2a2a]'
  };

  const hoverClasses = hover ? 'hover:shadow-2xl hover:-translate-y-1 cursor-pointer' : '';
  
  const cardClasses = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`;

  return (
    <motion.div
      className={cardClasses}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { 
        scale: 1.02,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={hover ? { 
        scale: 0.98,
        transition: { duration: 0.1 }
      } : {}}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;