import React from "react";

export default function HeroBanner() {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center bg-gray-900">
      {/* Banner Image */}
      <img
        src="/images/bihari-dish.jpg"
        alt="Delicious Bihari Dish"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Banner Text */}
      <div className="relative z-10 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold">
          Authentic Bihari Cuisine
        </h1>
        <p className="mt-4 text-lg md:text-xl">
          Taste the traditional flavors of Bihar, delivered fresh to your home.
        </p>
      </div>
    </div>
  );
}
