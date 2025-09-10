import React, { useState } from 'react';
import { motion } from '@/lib/safe-motion';
import { Star, Heart, Eye, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

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

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number) => void;
  onToggleWishlist?: (productId: number) => void;
  onQuickView?: (product: Product) => void;
  isInWishlist?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  onQuickView,
  isInWishlist = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (product.stock_quantity === 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently unavailable.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      if (onAddToCart) {
        await onAddToCart(product.id);
        toast({
          title: "Added to Cart",
          description: `${product.name} has been added to your cart.`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleWishlist = async () => {
    try {
      if (onToggleWishlist) {
        await onToggleWishlist(product.id);
        toast({
          title: isInWishlist ? "Removed from Wishlist" : "Added to Wishlist",
          description: `${product.name} has been ${isInWishlist ? 'removed from' : 'added to'} your wishlist.`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive"
      });
    }
  };

  const discountPercentage = product.original_price > product.price ?
  Math.round((product.original_price - product.price) / product.original_price * 100) :
  0;

  const isVegetarian = product.dietary_tags?.some((tag) => tag.name.toLowerCase().includes('vegetarian'));

  return (
    <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-gradient-to-br from-white to-warm-white hover:-translate-y-2 hover:scale-105">
      {/* Enhanced Discount Badge */}
      {discountPercentage > 0 &&
      <motion.div 
        className="absolute top-3 left-3 z-20"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
          <Badge className="bg-gradient-to-r from-clay-red to-clay-red-dark text-white font-bold px-3 py-1 rounded-full shadow-lg animate-pulse-slow">
            -{discountPercentage}%
          </Badge>
        </motion.div>
      }

      {/* Enhanced Wishlist Button */}
      <motion.div
        className="absolute top-3 right-3 z-20"
        initial={{ opacity: 0, scale: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          variant="ghost"
          size="sm"
          className="p-3 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/20"
          onClick={handleToggleWishlist}>

          <Heart
            className={`w-5 h-5 transition-all duration-300 ${
              isInWishlist 
                ? 'fill-clay-red text-clay-red animate-bounce-in' 
                : 'text-indigo-600 hover:text-clay-red'
            }`} />

        </Button>
      </motion.div>

      {/* Enhanced Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <motion.img
          src={product.main_image || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Image Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Enhanced Stock Status */}
        {product.stock_quantity === 0 &&
        <motion.div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
            <Badge variant="destructive" className="text-sm font-semibold px-4 py-2 bg-clay-red text-white shadow-lg">
              Out of Stock
            </Badge>
          </motion.div>
        }

        {/* Enhanced Quick View Button */}
        <motion.div
          className="absolute bottom-3 right-3"
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="secondary"
            size="sm"
            className="p-3 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/20"
            onClick={() => onQuickView?.(product)}>

            <Eye className="w-4 h-4 text-indigo-600" />
          </Button>
        </motion.div>

        {/* Shimmer Effect on Hover */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Enhanced Product Category & Badges */}
        <div className="flex items-center justify-between mb-3">
          {product.category_name &&
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Badge variant="outline" className="text-xs font-semibold px-3 py-1 bg-clay-red-50 text-clay-red border-clay-red-200 hover:bg-clay-red-100 transition-colors duration-200">
                {product.category_name}
              </Badge>
            </motion.div>
          }
          <div className="flex items-center space-x-2">
            {isVegetarian &&
            <motion.div 
              className="w-6 h-6 border-2 border-leaf-green-500 flex items-center justify-center rounded-full bg-leaf-green-50"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
                <div className="w-3 h-3 bg-leaf-green-500 rounded-full"></div>
              </motion.div>
            }
            {product.spice_level_name && product.spice_level &&
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Badge variant="outline" className="text-xs font-semibold px-3 py-1 bg-clay-red-50 text-clay-red-700 border-clay-red-200">
                  {'🌶️'.repeat(Math.min(product.spice_level, 3))} {product.spice_level_name}
                </Badge>
              </motion.div>
            }
          </div>
        </div>

        {/* Enhanced Product Name */}
        <motion.h3 
          className="font-bold text-gray-900 mb-2 line-clamp-2 text-base leading-tight group-hover:text-clay-red transition-colors duration-300"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {product.name}
        </motion.h3>

        {/* Enhanced Seller Name */}
        {product.seller_name &&
        <motion.p 
          className="text-sm text-indigo-600 mb-3 hover:text-clay-red cursor-pointer font-medium transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
            by {product.seller_name}
          </motion.p>
        }

        {/* Enhanced Rating */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              >
                <Star 
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating) 
                      ? 'text-turmeric-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`} 
                />
              </motion.div>
            ))}
          </div>
          <span className="text-sm font-bold text-gray-900">{product.rating}</span>
          <span className="text-xs text-gray-500">({product.review_count} reviews)</span>
        </div>

        {/* Enhanced Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.span 
              className="text-2xl font-bold text-gray-900"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              ₹{product.price}
            </motion.span>
            {product.original_price > product.price &&
            <motion.span 
              className="text-lg text-gray-500 line-through"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              ₹{product.original_price}
            </motion.span>
            }
          </div>
          {discountPercentage > 0 &&
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
          >
            <span className="text-sm font-bold text-leaf-green-600 bg-leaf-green-50 px-2 py-1 rounded-full">
              Save ₹{product.original_price - product.price}
            </span>
          </motion.div>
          }
        </div>

        {/* Enhanced Dietary Tags */}
        {product.dietary_tags && product.dietary_tags.length > 0 &&
        <div className="flex flex-wrap gap-2 mb-4">
            {product.dietary_tags.slice(0, 2).map((tag, index) =>
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Badge
              style={{ backgroundColor: tag.color }}
              className="text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200">

                {tag.name}
              </Badge>
            </motion.div>
          )}
            {product.dietary_tags.length > 2 &&
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Badge variant="outline" className="text-xs font-semibold px-3 py-1 bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                +{product.dietary_tags.length - 2} more
              </Badge>
            </motion.div>
          }
          </div>
        }

        {/* Enhanced Add to Cart Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            className={`w-full font-bold py-3 px-6 rounded-2xl transition-all duration-300 ${
              product.stock_quantity === 0 || isLoading
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-clay-red to-clay-red-dark hover:from-clay-red-dark hover:to-clay-red text-white shadow-lg hover:shadow-xl hover:shadow-colored'
            }`}
            size="lg"
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0 || isLoading}>

            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Adding...</span>
              </div>
            ) : product.stock_quantity === 0 ? (
              <div className="flex items-center space-x-2">
                <span>Out of Stock</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </div>
            )}
          </Button>
        </motion.div>
        <div className="mt-2">
          <Button
            className="w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            size="lg"
            onClick={async () => {
              await handleAddToCart();
              navigate('/checkout');
            }}
            disabled={product.stock_quantity === 0 || isLoading}
          >
            Proceed to Checkout
          </Button>
        </div>
      </CardContent>
    </Card>);

};

export default ProductCard;