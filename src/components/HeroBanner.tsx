import React from "react";
import { motion } from "@/lib/safe-motion";
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Store } from 'lucide-react';
import AnimatedButton from './ui/AnimatedButton';

export default function HomeBanner() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="relative w-full h-[80vh] min-h-[600px] overflow-hidden">
      {/* Background with Glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-amber-500/5 to-green-500/10"></div>
      
      {/* Background Image */}
      <motion.img
        src="/banner.png"
        alt="Homepage Banner"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: "easeOut" }}
      />

      {/* Modern gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Main Heading */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <h1 className="text-6xl md:text-8xl font-display font-extrabold leading-tight">
              <span className="block">Authentic</span>
              <span className="block bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                Bihari Delicacies
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-light">
              From local kitchens to your doorstep - Experience the rich, authentic flavors of Bihar
            </p>
          </motion.div>
          
          {/* Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            variants={itemVariants}
          >
            <AnimatedButton
              variant="primary"
              size="lg"
              onClick={() => navigate('/shops')}
              icon={Store}
              iconPosition="right"
              className="min-w-[200px]"
            >
              Shop Now
            </AnimatedButton>
            
            <AnimatedButton
              variant="outline"
              size="lg"
              onClick={() => navigate('/recipes')}
              icon={BookOpen}
              iconPosition="right"
              className="min-w-[200px] bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/50"
            >
              Explore Recipes
            </AnimatedButton>
            
            <AnimatedButton
              variant="secondary"
              size="lg"
              onClick={() => navigate('/register')}
              className="min-w-[200px] bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 hover:from-amber-500 hover:to-yellow-600"
            >
              Become a Seller
            </AnimatedButton>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Floating Decorative Elements */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-yellow-500/20 rounded-full blur-3xl"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-32 right-32 w-40 h-40 bg-gradient-to-br from-red-400/20 to-pink-500/20 rounded-full blur-3xl"
        animate={{
          y: [0, 20, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-2xl"
        animate={{
          y: [0, -15, 0],
          x: [0, 15, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}
