import React from "react";

export default function HomeBanner() {
  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Background Image */}
      <img
        src="/ChatGPT Image Sep 4, 2025, 08_46_30 PM.png"
        alt="Homepage Banner"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Authentic Bihari <span className="text-yellow-400">Snacks & Sweets</span>
        </h1>
        <p className="text-lg md:text-xl mb-6">
          From local kitchens to your doorstep
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg text-lg font-semibold">
            Shop Now →
          </button>
          <button className="bg-white hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg text-lg font-semibold">
            Explore Recipes
          </button>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg text-lg font-semibold">
            Become a Seller
          </button>
        </div>
      </div>
    </div>
  );
}
