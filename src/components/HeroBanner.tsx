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
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      </div>

      {/* Removed background image as requested */}

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
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-extrabold leading-tight">
              <span className="block text-white">Savor the</span>
              <span className="block bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 bg-clip-text text-transparent">
                Authentic Taste
              </span>
              <span className="block text-white">of Bihar</span>
            </h1>
            
            <p className="text-base md:text-lg text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Discover handcrafted delicacies from traditional Bihari kitchens. From Silao Khaja to Litti Chokha - every bite tells a story of heritage and flavor.
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
              className="min-w-[220px] h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-2xl shadow-blue-500/25"
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
              className="min-w-[220px] h-14 text-lg font-semibold bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600 shadow-2xl shadow-blue-500/25"
            >
              Start Selling
            </AnimatedButton>
          </motion.div>

          {/* Green Box - Special Offer Banner */}
          <motion.div 
            className="mt-12 p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-xl border-2 border-green-400"
            variants={itemVariants}
          >
            <p className="text-white font-medium text-center">
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
