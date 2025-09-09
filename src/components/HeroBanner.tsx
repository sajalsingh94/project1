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
      {/* Enhanced Dynamic Background with Food-Inspired Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-clay-red via-turmeric-yellow to-leaf-green animate-gradient-shift"></div>
      
      {/* Animated Background Pattern - Food-Inspired */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2280%22%20height%3D%2280%22%20viewBox%3D%220%200%2080%2080%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.15%22%3E%3Cpath%20d%3D%22M40%2040c0-11.046-8.954-20-20-20s-20%208.954-20%2020%208.954%2020%2020%2020%2020-8.954%2020-20zm20%200c0-11.046-8.954-20-20-20s-20%208.954-20%2020%208.954%2020%2020%2020%2020-8.954%2020-20z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      </div>

      {/* Enhanced gradient overlays for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-clay-red-900/30 via-transparent to-turmeric-yellow-900/30"></div>
      
      {/* Additional overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-black/20 to-black/40"></div>

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
            <motion.div 
              className="inline-block px-6 py-3 bg-white/15 backdrop-blur-md rounded-full border border-white/30 text-sm font-semibold shadow-lg"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              transition={{ duration: 0.3 }}
            >
              🍽️ Traditional Recipes • 🏠 Home Delivery • 🌟 Premium Quality
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.span 
                className="block text-white mb-2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Savor the
              </motion.span>
              <motion.span 
                className="block bg-gradient-to-r from-turmeric-yellow-300 via-turmeric-yellow-400 to-turmeric-yellow-500 bg-clip-text text-transparent mb-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Authentic Taste
              </motion.span>
              <motion.span 
                className="block text-white"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                of Bihar
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-100 max-w-4xl mx-auto leading-relaxed font-medium"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              Discover handcrafted delicacies from traditional Bihari kitchens. From Silao Khaja to Litti Chokha - every bite tells a story of heritage and flavor.
            </motion.p>
          </motion.div>
          
          {/* Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <AnimatedButton
                variant="primary"
                size="lg"
                onClick={() => navigate('/shops')}
                icon={Store}
                iconPosition="right"
                className="min-w-[240px] h-16 text-lg font-bold bg-gradient-to-r from-clay-red to-clay-red-dark hover:from-clay-red-dark hover:to-clay-red shadow-2xl shadow-colored group-hover:shadow-3xl transition-all duration-300"
              >
                <span className="relative z-10">Explore Products</span>
              </AnimatedButton>
              <div className="absolute inset-0 bg-gradient-to-r from-turmeric-yellow to-leaf-green rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <AnimatedButton
                variant="outline"
                size="lg"
                onClick={() => navigate('/recipes')}
                icon={BookOpen}
                iconPosition="right"
                className="min-w-[240px] h-16 text-lg font-bold bg-white/20 backdrop-blur-md border-2 border-white/50 text-white hover:bg-white/30 hover:border-white/70 shadow-xl group-hover:shadow-2xl transition-all duration-300"
              >
                <span className="relative z-10">Learn Recipes</span>
              </AnimatedButton>
              <div className="absolute inset-0 bg-gradient-to-r from-turmeric-yellow/20 to-leaf-green/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <AnimatedButton
                variant="secondary"
                size="lg"
                onClick={() => navigate('/register?mode=signup&role=seller')}
                className="min-w-[240px] h-16 text-lg font-bold bg-gradient-to-r from-turmeric-yellow to-turmeric-yellow-dark text-dark-brown hover:from-turmeric-yellow-light hover:to-leaf-green shadow-2xl shadow-golden group-hover:shadow-3xl transition-all duration-300"
              >
                <span className="relative z-10">Start Selling</span>
              </AnimatedButton>
              <div className="absolute inset-0 bg-gradient-to-r from-leaf-green/20 to-clay-red/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </motion.div>
          </motion.div>

          {/* Enhanced Special Offer Banner */}
          <motion.div 
            className="mt-12 p-8 bg-gradient-to-r from-leaf-green to-leaf-green-light rounded-3xl shadow-2xl border-2 border-leaf-green-300 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="relative z-10">
              <p className="text-white font-bold text-center text-lg">
                🎉 <span className="text-turmeric-yellow-200 font-extrabold">New User Special:</span> Get 15% off your first order + Free delivery on orders above ₹500
              </p>
            </div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-turmeric-yellow to-clay-red"></div>
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
