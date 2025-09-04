
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Truck,
  RotateCcw,
  Shield,
  Calendar,
  Award } from
'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ProductCard from '@/components/ProductCard';
import SEOHead from '@/components/SEOHead';
import { useToast } from '@/hooks/use-toast';

interface Seller {
  id: number;
  business_name: string;
  owner_name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  email: string;
  phone: string;
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  established_year: number;
  specialties: string;
  profile_image?: string;
  banner_image?: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price: number;
  rating: number;
  review_count: number;
  main_image: string;
  is_featured: boolean;
  is_bestseller: boolean;
}

const SellerDetailPage: React.FC = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellerData();
  }, [sellerId]);

  const fetchSellerData = async () => {
    try {
      setLoading(true);

      // Fetch seller details
      const sellerResponse = await window.ezsite.apis.tablePage(39101, {
        PageNo: 1,
        PageSize: 1,
        Filters: [{ name: "ID", op: "Equal", value: parseInt(sellerId!) }]
      });

      if (sellerResponse.error) throw sellerResponse.error;

      if (sellerResponse.data.List.length === 0) {
        toast({ title: "Seller not found", variant: "destructive" });
        navigate('/shops');
        return;
      }

      setSeller(sellerResponse.data.List[0]);

      // Fetch products by this seller
      const productsResponse = await window.ezsite.apis.tablePage(39102, {
        PageNo: 1,
        PageSize: 20,
        Filters: [{ name: "seller_id", op: "Equal", value: parseInt(sellerId!) }],
        OrderByField: "rating",
        IsAsc: false
      });

      if (productsResponse.error) throw productsResponse.error;
      setProducts(productsResponse.data.List);

    } catch (error) {
      console.error('Error fetching seller data:', error);
      toast({ title: "Failed to load seller data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-red-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>);

  }

  if (!seller) return null;

  const specialtyList = seller.specialties.split(',').map((s) => s.trim()).filter(Boolean);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-red-50">
      <SEOHead
        title={`${seller.business_name} - Mithila Bites`}
        description={seller.description} />

      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/shops')}
          className="mb-6 text-gray-600 hover:text-gray-900">

          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shops
        </Button>

        {/* Seller Banner */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 h-32 relative">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>
          <div className="p-6 relative -mt-16">
            <div className="flex flex-col md:flex-row gap-6">
              <div className={`w-32 h-32 bg-gradient-to-br ${getAvatarGradient(seller.business_name)} rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg border-4 border-white`}>
                {seller.business_name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{seller.business_name}</h1>
                  {seller.is_verified &&
                  <Shield className="w-6 h-6 text-blue-500" />
                  }
                </div>
                <p className="text-gray-600 mb-4">Owned by {seller.owner_name}</p>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="font-semibold">{seller.rating}</span>
                    <span className="text-gray-500">({seller.total_reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{seller.city}, {seller.state}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Since {seller.established_year}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {specialtyList.map((specialty, index) =>
                  <Badge key={index} className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                      {specialty}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Seller Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* About */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-3">About Our Shop</h3>
              <p className="text-gray-700 leading-relaxed">{seller.description}</p>
            </Card>

            {/* Contact Info */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{seller.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{seller.phone.replace(/(\d{2})(\d{4})(\d{4})/, '+91-****-**$3')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{seller.email.replace(/(.{2}).*@/, '$1***@')}</span>
                </div>
              </div>
            </Card>

            {/* Working Hours */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-3">Working Hours</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Monday - Friday</span>
                  <span className="text-green-600 font-medium">9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Saturday</span>
                  <span className="text-green-600 font-medium">9:00 AM - 9:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sunday</span>
                  <span className="text-red-600 font-medium">Closed</span>
                </div>
              </div>
            </Card>

            {/* Policies */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-3">Policies</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="w-4 h-4 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Shipping</h4>
                    <p className="text-xs text-gray-600">Free shipping on orders above ₹500</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RotateCcw className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Returns</h4>
                    <p className="text-xs text-gray-600">7-day return policy for unopened items</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-4 h-4 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Quality Guarantee</h4>
                    <p className="text-xs text-gray-600">Fresh products with quality assurance</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Products */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Products by {seller.business_name}</h2>
              <p className="text-gray-600">{products.length} products available</p>
            </div>

            {products.length === 0 ?
            <Card className="p-12 text-center">
                <p className="text-gray-500 mb-4">No products available from this seller yet.</p>
                <Button variant="outline" onClick={() => navigate('/shops')}>
                  Browse Other Shops
                </Button>
              </Card> :

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((product) =>
              <ProductCard key={product.id} product={product} />
              )}
              </div>
            }
          </div>
        </div>
      </div>
    </div>);

};

export default SellerDetailPage;