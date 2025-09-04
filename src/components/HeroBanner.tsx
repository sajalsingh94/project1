import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroBanner = () => {
  return (
    <section className="relative h-[600px] overflow-hidden">
      {/* Background collage */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-1">
        <div
          className="col-span-2 row-span-2 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop)' }} />

        <div
          className="col-span-1 row-span-1 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=200&h=200&fit=crop)' }} />

        <div
          className="col-span-1 row-span-1 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&h=200&fit=crop)' }} />

        <div
          className="col-span-2 row-span-2 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1692306088530-e81ab626753b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MTg3MTl8MHwxfHNlYXJjaHwxfHxBJTIwY3JvcHBlZCUyMGltYWdlJTIwb2YlMjBhJTIwdmlzdWFsbHklMjBhcHBlYWxpbmclMjBzdWJqZWN0JTIwd2l0aCUyMGRpbWVuc2lvbnMlMjBvZiUyMDQwMHg0MDAlMjBwaXhlbHMufGVufDB8fHx8MTc1NjkxODQyOXww&ixlib=rb-4.1.0&q=80&w=200$w=400)' }} />

        <div
          className="col-span-1 row-span-1 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1596797038530-2c107229654b?w=200&h=200&fit=crop)' }} />

        <div
          className="col-span-1 row-span-1 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=200&h=200&fit=crop)' }} />

        <div
          className="col-span-2 row-span-2 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1589550036685-900d74751d2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MTg3MTl8MHwxfHNlYXJjaHwxfHxBJTIwcGhvdG9ncmFwaCUyMHNob3djYXNpbmclMjBhJTIwdmlzdWFsbHklMjBhcHBlYWxpbmclMjBzdWJqZWN0JTJDJTIwY3JvcHBlZCUyMHRvJTIwYSUyMHNxdWFyZSUyMGZvcm1hdCUyMHdpdGglMjBkaW1lbnNpb25zJTIwb2YlMjA0MDB4NDAwJTIwcGl4ZWxzLnxlbnwwfHx8fDE3NTY5MTg0MjZ8MA&ixlib=rb-4.1.0&q=80&w=200$w=400)' }} />

        <div
          className="col-span-2 row-span-2 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1692306088530-e81ab626753b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MTg3MTl8MHwxfHNlYXJjaHwxfHxBJTIwY3JvcHBlZCUyMGltYWdlJTIwb2YlMjBhJTIwdmlzdWFsbHklMjBhcHBlYWxpbmclMjBzdWJqZWN0JTIwd2l0aCUyMGRpbWVuc2lvbnMlMjBvZiUyMDQwMHg0MDAlMjBwaXhlbHMufGVufDB8fHx8MTc1NjkxODQyOXww&ixlib=rb-4.1.0&q=80&w=200$w=400)' }} />

        <div
          className="col-span-1 row-span-1 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=200&h=200&fit=crop)' }} />

        <div
          className="col-span-1 row-span-1 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=200&fit=crop)' }} />

      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white max-w-4xl px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            Authentic Bihari<br />
            <span className="text-yellow-400">Snacks & Sweets</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            From local kitchens to your doorstep
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shops">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg">
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/recipes">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg bg-white text-[#0a0a0a]">

                Explore Recipes
              </Button>
            </Link>
            <Link to="/become-seller">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-4 text-lg">

                Become a Seller
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>);

};

export default HeroBanner;