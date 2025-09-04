
import React from 'react';
import { Star, MapPin, Clock, Truck, Shield, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SellerCardProps {
  seller: {
    id: number;
    business_name: string;
    owner_name: string;
    description: string;
    city: string;
    rating: number;
    total_reviews: number;
    is_verified: boolean;
    specialties: string;
    profile_image?: string;
  };
}

const MadhubaniBorder = ({ children }: {children: React.ReactNode;}) =>
<div className="relative p-1 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 rounded-2xl">
    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 rounded-2xl opacity-20 animate-pulse"></div>
    
    {/* Decorative corner patterns */}
    <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-yellow-400 rounded-tl-lg"></div>
    <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-yellow-400 rounded-tr-lg"></div>
    <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-yellow-400 rounded-bl-lg"></div>
    <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-yellow-400 rounded-br-lg"></div>
    
    {/* Central decorative dots */}
    <div className="absolute top-1/2 left-1 w-1 h-1 bg-yellow-300 rounded-full transform -translate-y-1/2"></div>
    <div className="absolute top-1/2 right-1 w-1 h-1 bg-yellow-300 rounded-full transform -translate-y-1/2"></div>
    
    <div className="bg-white rounded-xl relative z-10">
      {children}
    </div>
  </div>;


const SellerCard: React.FC<SellerCardProps> = ({ seller }) => {
  const navigate = useNavigate();
  const specialtyList = seller.specialties.split(',').map((s) => s.trim()).filter(Boolean);

  // Generate a colorful avatar based on seller name
  const getAvatarGradient = (name: string) => {
    const colors = [
    'from-purple-400 to-pink-400',
    'from-blue-400 to-cyan-400',
    'from-green-400 to-emerald-400',
    'from-yellow-400 to-orange-400',
    'from-red-400 to-rose-400',
    'from-indigo-400 to-purple-400'];

    const index = name.length % colors.length;
    return colors[index];
  };

  const handleViewShop = () => {
    navigate(`/seller/${seller.id}`);
  };

  return (
    <MadhubaniBorder>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0">
        <div className="p-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-16 h-16 bg-gradient-to-br ${getAvatarGradient(seller.business_name)} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
              {seller.business_name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg text-gray-900 truncate">
                  {seller.business_name}
                </h3>
                {seller.is_verified &&
                <Shield className="w-4 h-4 text-blue-500 flex-shrink-0" />
                }
              </div>
              <p className="text-sm text-gray-600 mb-2">by {seller.owner_name}</p>
              <div className="flex items-center gap-1 text-sm">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span className="text-gray-600">{seller.city}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-sm mb-4 line-clamp-2">
            {seller.description}
          </p>

          {/* Status and Info Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">Open</span>
              </div>
              <div className="flex items-center gap-1">
                <Truck className="w-3 h-3 text-blue-500" />
                <span className="text-xs text-gray-600">Fast Delivery</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-medium text-sm">{seller.rating}</span>
              <span className="text-xs text-gray-500">({seller.total_reviews})</span>
            </div>
          </div>

          {/* Specialty Badges */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {specialtyList.slice(0, 3).map((specialty, index) =>
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-2 py-1 bg-orange-50 text-orange-700 hover:bg-orange-100">

                  {specialty}
                </Badge>
              )}
              {specialtyList.length > 3 &&
              <Badge variant="outline" className="text-xs px-2 py-1">
                  +{specialtyList.length - 3} more
                </Badge>
              }
            </div>
          </div>

          {/* View Shop Button */}
          <Button
            onClick={handleViewShop}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium">

            View Shop
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </Card>
    </MadhubaniBorder>);

};

export default SellerCard;