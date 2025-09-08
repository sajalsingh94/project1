import React from "react";
import { useNavigate } from 'react-router-dom';

export default function HomeBanner() {
  const navigate = useNavigate();
  return (
    <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-clay-red/20 via-turmeric-yellow/10 to-leaf-green/20"></div>
      <img
        src="/banner.png"
        alt="Homepage Banner"
        className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-[10s] ease-out"
      />

      {/* Modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-playfair font-bold text-shadow leading-tight">
              Authentic Bihari
              <span className="block bg-gradient-to-r from-turmeric-yellow to-yellow-300 bg-clip-text text-transparent">
                Snacks & Sweets
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 font-poppins max-w-2xl mx-auto leading-relaxed">
              From local kitchens to your doorstep - Experience the rich flavors of Bihar
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => navigate('/shops')} 
              className="group bg-gradient-to-r from-clay-red to-clay-red-dark hover:from-clay-red-dark hover:to-clay-red text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-2"
            >
              <span>Shop Now</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            
            <button 
              onClick={() => navigate('/recipes')} 
              className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-2"
            >
              <span>Explore Recipes</span>
              <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </button>
            
            <button 
              onClick={() => navigate('/register')} 
              className="group bg-gradient-to-r from-turmeric-yellow to-turmeric-yellow-dark hover:from-turmeric-yellow-dark hover:to-turmeric-yellow text-dark-brown px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-2"
            >
              <span>Become a Seller</span>
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-turmeric-yellow/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-clay-red/20 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-leaf-green/20 rounded-full blur-lg"></div>
    </div>
  );
}
