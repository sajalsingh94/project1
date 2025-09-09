import React from "react";
import { motion } from "@/lib/safe-motion";
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Store, Star, Users, Award } from 'lucide-react';
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
    <div className="relative w-full h-[90vh] min-h-[700px] overflow-hidden">
      {/* Dynamic Background with Multiple Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-red-500 to-amber-600"></div>
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      </div>

      {/* Background Image with Parallax Effect */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.2, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 10, ease: "easeOut" }}
      >
        <img
          src="/banner.png"
          alt="Traditional Bihari Cuisine"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Enhanced gradient overlays for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-transparent to-amber-900/20"></div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Trust Indicators */}
          <motion.div 
            className="flex flex-wrap justify-center gap-8 text-sm text-gray-300"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>1000+ Happy Customers</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-green-400" />
              <span>Authentic Local Sellers</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div className="space-y-8" variants={itemVariants}>
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-sm font-medium">
              🍽️ Traditional Recipes • 🏠 Home Delivery • 🌟 Premium Quality
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold leading-tight">
              <span className="block text-white">Savor the</span>
              <span className="block bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                Authentic Taste
              </span>
              <span className="block text-white">of Bihar</span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed font-light">
              Discover handcrafted delicacies from traditional Bihari kitchens. 
              <br className="hidden md:block" />
              From the famous <span className="text-yellow-300 font-semibold">Silao Khaja</span> to spicy <span className="text-orange-300 font-semibold">Litti Chokha</span> - 
              every bite tells a story of heritage and flavor.
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
              className="min-w-[220px] h-14 text-lg font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-2xl shadow-orange-500/25"
            >
              Explore Products
            </AnimatedButton>
            
            <AnimatedButton
              variant="outline"
              size="lg"
              onClick={() => navigate('/recipes')}
              icon={BookOpen}
              iconPosition="right"
              className="min-w-[220px] h-14 text-lg font-semibold bg-white/15 backdrop-blur-md border-white/40 text-white hover:bg-white/25 hover:border-white/60 shadow-xl"
            >
              Learn Recipes
            </AnimatedButton>
            
            <AnimatedButton
              variant="secondary"
              size="lg"
              onClick={() => navigate('/register?mode=signup&role=seller')}
              className="min-w-[220px] h-14 text-lg font-semibold bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 hover:from-yellow-500 hover:to-amber-600 shadow-2xl shadow-yellow-500/25"
            >
              Start Selling
            </AnimatedButton>
          </motion.div>

          {/* Special Offer Banner */}
          <motion.div 
            className="mt-12 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl border border-green-400/30"
            variants={itemVariants}
          >
            <p className="text-green-200 font-medium">
              🎉 <span className="font-bold">New User Special:</span> Get 15% off your first order + Free delivery on orders above ₹500
            </p>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Enhanced Floating Decorative Elements */}
      <motion.div
        className="absolute top-16 left-16 w-40 h-40 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-full blur-3xl"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-red-400/25 to-pink-500/25 rounded-full blur-3xl"
        animate={{
          y: [0, 25, 0],
          x: [0, -15, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute top-1/3 right-1/4 w-32 h-32 bg-gradient-to-br from-green-400/25 to-emerald-500/25 rounded-full blur-2xl"
        animate={{
          y: [0, -20, 0],
          x: [0, 25, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-1/3 left-1/3 w-28 h-28 bg-gradient-to-br from-purple-400/20 to-indigo-500/20 rounded-full blur-2xl"
        animate={{
          y: [0, 15, 0],
          x: [0, -20, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Subtle floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}
