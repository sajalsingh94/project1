import React from 'react';
import { motion } from '@/lib/safe-motion';
import { Heart, ShoppingCart, Star, Eye, Plus } from 'lucide-react';
import AnimatedButton from './ui/AnimatedButton';
import AnimatedCard from './ui/AnimatedCard';

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
  dietary_tags?: Array<{name: string; color: string;}>;
  is_featured: boolean;
  is_bestseller: boolean;
}

interface ModernProductCardProps {
  product: Product;
  onAddToCart: (productId: number) => void;
  onToggleWishlist: (productId: number) => void;
  onQuickView: (product: Product) => void;
  isInWishlist: boolean;
}

const ModernProductCard: React.FC<ModernProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  onQuickView,
  isInWishlist
}) => {
  const discountPercentage = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <AnimatedCard
      className="group overflow-hidden"
      hover={true}
      initial={{ opacity: 0, y: 20 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <motion.img
          src={product.main_image || '/placeholder.svg'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.is_featured && (
            <motion.span
              className="px-2 py-1 bg-gradient-to-r from-red-500 to-amber-500 text-white text-xs font-semibold rounded-full shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              Featured
            </motion.span>
          )}
          {product.is_bestseller && (
            <motion.span
              className="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold rounded-full shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              Bestseller
            </motion.span>
          )}
          {discountPercentage > 0 && (
            <motion.span
              className="px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold rounded-full shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              -{discountPercentage}%
            </motion.span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <motion.button
            onClick={() => onToggleWishlist(product.id)}
            className={`p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 ${
              isInWishlist
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
          </motion.button>
          
          <motion.button
            onClick={() => onQuickView(product)}
            className="p-2 bg-white/90 text-gray-700 rounded-full shadow-lg backdrop-blur-sm hover:bg-blue-500 hover:text-white transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Eye className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Quick Add Button */}
        <motion.div
          className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
          initial={{ y: 20 }}
          whileHover={{ y: 0 }}
        >
          <AnimatedButton
            variant="primary"
            size="sm"
            onClick={() => onAddToCart(product.id)}
            className="w-full bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white shadow-lg"
            icon={Plus}
          >
            Add to Cart
          </AnimatedButton>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category & Seller */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          {product.category_name && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
              {product.category_name}
            </span>
          )}
          {product.seller_name && (
            <span className="truncate">by {product.seller_name}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-red-600 transition-colors duration-200">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm text-gray-500">
            ({product.review_count})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              ₹{product.price}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.original_price}
              </span>
            )}
          </div>
          
          {/* Stock Indicator */}
          <div className={`text-xs px-2 py-1 rounded-full ${
            product.stock_quantity > 10
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : product.stock_quantity > 0
              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            {product.stock_quantity > 10 ? 'In Stock' : 
             product.stock_quantity > 0 ? 'Low Stock' : 'Out of Stock'}
          </div>
        </div>

        {/* Dietary Tags */}
        {product.dietary_tags && product.dietary_tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.dietary_tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded-full"
                style={{ 
                  backgroundColor: `${tag.color}20`,
                  color: tag.color,
                  border: `1px solid ${tag.color}40`
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </AnimatedCard>
  );
};

export default ModernProductCard;