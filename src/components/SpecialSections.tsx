import React from 'react';
import { ArrowRight, TrendingUp, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price: number;
  main_image: string;
  rating: number;
  review_count: number;
  seller_id: number;
  seller_name?: string;
  category_name?: string;
  spice_level_name?: string;
  spice_level?: number;
  stock_quantity: number;
  dietary_tags?: Array<{name: string;color: string;}>;
}

interface SpecialSectionsProps {
  trendingProducts: Product[];
  newProducts: Product[];
  highlyRatedProducts: Product[];
  onAddToCart?: (productId: number) => void;
  onToggleWishlist?: (productId: number) => void;
  onQuickView?: (product: Product) => void;
  isInWishlist?: (productId: number) => boolean;
}

const SpecialSections: React.FC<SpecialSectionsProps> = ({
  trendingProducts,
  newProducts,
  highlyRatedProducts,
  onAddToCart,
  onToggleWishlist,
  onQuickView,
  isInWishlist
}) => {
  const Section = ({
    title,
    subtitle,
    icon: Icon,
    products,
    gradientFrom,
    gradientTo,
    linkTo








  }: {title: string;subtitle: string;icon: any;products: Product[];gradientFrom: string;gradientTo: string;linkTo: string;}) =>
  <section className={`py-16 bg-gradient-to-br from-${gradientFrom} to-${gradientTo}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <Icon className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {title}
              </h2>
              <p className="text-white/80">
                {subtitle}
              </p>
            </div>
          </div>
          <Link to={linkTo}>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
              View All
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) =>
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          onQuickView={onQuickView}
          isInWishlist={isInWishlist?.(product.id)} />

        )}
        </div>
      </div>
    </section>;


  return (
    <>
      {/* Trending Now */}
      {trendingProducts.length > 0 &&
      <Section
        title="Trending Now"
        subtitle="Most popular products this week"
        icon={TrendingUp}
        products={trendingProducts}
        gradientFrom="orange-500"
        gradientTo="red-600"
        linkTo="/shops?filter=trending" />

      }

      {/* New This Week */}
      {newProducts.length > 0 &&
      <Section
        title="New This Week"
        subtitle="Fresh arrivals from our artisans"
        icon={Clock}
        products={newProducts}
        gradientFrom="green-500"
        gradientTo="teal-600"
        linkTo="/shops?filter=new" />

      }

      {/* Highly Rated */}
      {highlyRatedProducts.length > 0 &&
      <Section
        title="Highly Rated"
        subtitle="Customer favorites with 4.5+ ratings"
        icon={Star}
        products={highlyRatedProducts}
        gradientFrom="purple-500"
        gradientTo="indigo-600"
        linkTo="/shops?filter=highly-rated" />

      }
    </>);

};

export default SpecialSections;