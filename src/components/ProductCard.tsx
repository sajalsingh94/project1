import React, { useState } from 'react';
import { Star, Heart, Eye, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      {/* Discount Badge */}
      {discountPercentage > 0 &&
      <div className="absolute top-2 left-2 z-10">
          <Badge className="bg-red-500 text-white">
            -{discountPercentage}%
          </Badge>
        </div>
      }

      {/* Wishlist Button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 z-10 p-2 bg-white/80 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleToggleWishlist}>

        <Heart
          className={`w-4 h-4 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />

      </Button>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.main_image || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />

        
        {/* Stock Status */}
        {product.stock_quantity === 0 &&
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm">
              Out of Stock
            </Badge>
          </div>
        }

        {/* Quick View Button */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2"
          onClick={() => onQuickView?.(product)}>

          <Eye className="w-4 h-4" />
        </Button>
      </div>

      <CardContent className="p-4">
        {/* Product Category & Badges */}
        <div className="flex items-center justify-between mb-2">
          {product.category_name &&
          <Badge variant="outline" className="text-xs">
              {product.category_name}
            </Badge>
          }
          <div className="flex items-center space-x-1">
            {isVegetarian &&
            <div className="w-4 h-4 border border-green-600 flex items-center justify-center rounded">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              </div>
            }
            {product.spice_level_name && product.spice_level &&
            <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                {'🌶️'.repeat(Math.min(product.spice_level, 3))}
              </Badge>
            }
          </div>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm">
          {product.name}
        </h3>

        {/* Seller Name */}
        {product.seller_name &&
        <p className="text-xs text-gray-600 mb-2 hover:text-orange-600 cursor-pointer">
            by {product.seller_name}
          </p>
        }

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-xs text-gray-500">({product.review_count})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
            {product.original_price > product.price &&
            <span className="text-sm text-gray-500 line-through">₹{product.original_price}</span>
            }
          </div>
        </div>

        {/* Dietary Tags */}
        {product.dietary_tags && product.dietary_tags.length > 0 &&
        <div className="flex flex-wrap gap-1 mb-3">
            {product.dietary_tags.slice(0, 2).map((tag, index) =>
          <Badge
            key={index}
            style={{ backgroundColor: tag.color }}
            className="text-white text-xs">

                {tag.name}
              </Badge>
          )}
            {product.dietary_tags.length > 2 &&
          <Badge variant="outline" className="text-xs">
                +{product.dietary_tags.length - 2} more
              </Badge>
          }
          </div>
        }

        {/* Add to Cart Button */}
        <Button
          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          size="sm"
          onClick={handleAddToCart}
          disabled={product.stock_quantity === 0 || isLoading}>

          {isLoading ?
          "Adding..." :
          product.stock_quantity === 0 ?
          "Out of Stock" :

          <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </>
          }
        </Button>
      </CardContent>
    </Card>);

};

export default ProductCard;