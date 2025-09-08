import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { Helmet } from 'react-helmet-async';
import { 
  Store, 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  Star,
  Eye,
  ShoppingCart,
  BarChart3,
  Settings
} from 'lucide-react';
import SellerAnalytics from '@/components/SellerAnalytics';

interface SellerProfile {
  _id?: string;
  id?: string;
  businessName?: string;
  business_name?: string;
  ownerName?: string;
  owner_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  description?: string;
  profileImagePath?: string;
  profile_image_path?: string;
  bannerImagePath?: string;
  banner_image_path?: string;
  isVerified?: boolean;
  is_verified?: boolean;
  rating?: number;
  totalReviews?: number;
  total_reviews?: number;
  createdAt?: string;
  created_at?: string;
}

interface Product {
  _id?: string;
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  original_price?: number;
  weight?: string;
  ingredients?: string;
  shelfLife?: string;
  shelf_life?: string;
  stockQuantity?: number;
  stock_quantity?: number;
  mainImagePath?: string;
  main_image?: string;
  additionalImages?: string[];
  additional_images?: string[];
  isActive?: boolean;
  is_active?: boolean;
  createdAt?: string;
  created_at?: string;
}

const SellerDashboardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(tabParam);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Update active tab when URL changes
  useEffect(() => {
    const tabParam = searchParams.get('tab') || 'profile';
    setActiveTab(tabParam);
  }, [searchParams]);

  // Seller profile form state
  const [profileForm, setProfileForm] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    description: ''
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);

  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    weight: '',
    ingredients: '',
    shelfLife: '',
    stockQuantity: '',
    categoryId: '1',
    spiceLevelId: '1'
  });
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);

  useEffect(() => {
    loadSellerData();
  }, []);

  const loadSellerData = async () => {
    try {
      setIsLoading(true);
      
      // Load seller profile
      const { data: sellerData, error: sellerError } = await api.sellers.getMe();
      if (sellerError) {
        if (sellerError.includes('not found')) {
          // Seller profile doesn't exist yet
          setSellerProfile(null);
        } else {
          toast({
            title: "Error",
            description: "Failed to load seller profile",
            variant: "destructive"
          });
        }
      } else {
        setSellerProfile(sellerData);
        setProfileForm({
          businessName: sellerData.businessName || sellerData.business_name || '',
          ownerName: sellerData.ownerName || sellerData.owner_name || '',
          email: sellerData.email || '',
          phone: sellerData.phone || '',
          address: sellerData.address || '',
          city: sellerData.city || '',
          state: sellerData.state || '',
          description: sellerData.description || ''
        });
      }

      // Load products
      const { data: productsData, error: productsError } = await api.products.getMe();
      if (productsError) {
        console.error('Failed to load products:', productsError);
      } else {
        setProducts(productsData || []);
      }
    } catch (error) {
      console.error('Error loading seller data:', error);
      toast({
        title: "Error",
        description: "Failed to load seller data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: any = { ...profileForm };
      if (profileImage) payload.profile_image = profileImage;
      if (bannerImage) payload.banner_image = bannerImage;

      const { data, error } = await api.sellers.create(payload);
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Seller profile created successfully!"
        });
        setSellerProfile(data);
        setActiveTab('products');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create seller profile",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: any = { ...productForm };
      if (mainImage) payload.main_image = mainImage;
      if (additionalImages.length > 0) payload.additional_images = additionalImages;

      const { data, error } = await api.products.create(payload);
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Product created successfully!"
        });
        setProducts(prev => [...prev, data]);
        // Reset form
        setProductForm({
          name: '',
          description: '',
          price: '',
          originalPrice: '',
          weight: '',
          ingredients: '',
          shelfLife: '',
          stockQuantity: '',
          categoryId: '1',
          spiceLevelId: '1'
        });
        setMainImage(null);
        setAdditionalImages([]);
        // Navigate back to products tab
        setActiveTab('products');
        navigate('/seller/dashboard?tab=products');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <Helmet>
        <title>Seller Dashboard | Bihari Delicacies</title>
      </Helmet>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Manage your shop and products</p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value);
        navigate(`/seller/dashboard?tab=${value}`);
      }} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {!sellerProfile ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  Create Seller Profile
                </CardTitle>
                <CardDescription>
                  Set up your seller profile to start selling on our platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        value={profileForm.businessName}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, businessName: e.target.value }))}
                        placeholder="Mithaiwala Sweets"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownerName">Owner Name *</Label>
                      <Input
                        id="ownerName"
                        value={profileForm.ownerName}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, ownerName: e.target.value }))}
                        placeholder="Ram Prasad Gupta"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="owner@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={profileForm.address}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Street, City, State"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="Patna"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={profileForm.state}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, state: e.target.value }))}
                        placeholder="Bihar"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={profileForm.description}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Family business serving authentic sweets since 1950"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileImage">Profile Image</Label>
                      <Input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bannerImage">Banner Image</Label>
                      <Input
                        id="bannerImage"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setBannerImage(e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Creating Profile...' : 'Create Seller Profile'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Store className="w-5 h-5" />
                      {sellerProfile.businessName || sellerProfile.business_name}
                    </CardTitle>
                    <CardDescription>
                      {sellerProfile.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{sellerProfile.ownerName || sellerProfile.owner_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{sellerProfile.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{sellerProfile.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{sellerProfile.city}, {sellerProfile.state}</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">
                          {sellerProfile.rating || 0}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({sellerProfile.totalReviews || sellerProfile.total_reviews || 0} reviews)
                        </span>
                      </div>
                      <Badge variant={sellerProfile.isVerified || sellerProfile.is_verified ? "default" : "secondary"}>
                        {sellerProfile.isVerified || sellerProfile.is_verified ? "Verified" : "Pending Verification"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Products</span>
                      <span className="font-semibold">{products.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Active Products</span>
                      <span className="font-semibold">
                        {products.filter(p => p.isActive !== false && p.is_active !== false).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Stock</span>
                      <span className="font-semibold">
                        {products.reduce((sum, p) => sum + (p.stockQuantity || p.stock_quantity || 0), 0)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Products</h2>
            <Button onClick={() => setActiveTab('add-product')} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </div>

          {products.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
                <p className="text-gray-600 text-center mb-4">
                  Start by adding your first product to begin selling
                </p>
                <Button onClick={() => setActiveTab('add-product')} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Your First Product
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product._id || product.id} className="overflow-hidden">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    {product.mainImagePath || product.main_image ? (
                      <img
                        src={product.mainImagePath || product.main_image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-orange-600">
                        ₹{product.price}
                      </span>
                      {product.originalPrice || product.original_price ? (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.originalPrice || product.original_price}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>Stock: {product.stockQuantity || product.stock_quantity || 0}</span>
                      <span>{product.weight}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="add-product" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Product
              </CardTitle>
              <CardDescription>
                Add a new product to your inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProductSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="productName">Product Name *</Label>
                    <Input
                      id="productName"
                      value={productForm.name}
                      onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Authentic Silao Khaja"
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="productDescription">Description</Label>
                    <Textarea
                      id="productDescription"
                      value={productForm.description}
                      onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Traditional layered sweet from Silao"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="350"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price (₹)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm(prev => ({ ...prev, originalPrice: e.target.value }))}
                      placeholder="400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <Input
                      id="weight"
                      value={productForm.weight}
                      onChange={(e) => setProductForm(prev => ({ ...prev, weight: e.target.value }))}
                      placeholder="500g"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stockQuantity">Stock Quantity</Label>
                    <Input
                      id="stockQuantity"
                      type="number"
                      value={productForm.stockQuantity}
                      onChange={(e) => setProductForm(prev => ({ ...prev, stockQuantity: e.target.value }))}
                      placeholder="25"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shelfLife">Shelf Life</Label>
                    <Input
                      id="shelfLife"
                      value={productForm.shelfLife}
                      onChange={(e) => setProductForm(prev => ({ ...prev, shelfLife: e.target.value }))}
                      placeholder="15 days"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Category</Label>
                    <Input
                      id="categoryId"
                      type="number"
                      value={productForm.categoryId}
                      onChange={(e) => setProductForm(prev => ({ ...prev, categoryId: e.target.value }))}
                      placeholder="1"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="ingredients">Ingredients</Label>
                    <Textarea
                      id="ingredients"
                      value={productForm.ingredients}
                      onChange={(e) => setProductForm(prev => ({ ...prev, ingredients: e.target.value }))}
                      placeholder="Refined flour, Pure ghee, Sugar, Cardamom"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mainImage">Main Image *</Label>
                    <Input
                      id="mainImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setMainImage(e.target.files?.[0] || null)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="additionalImages">Additional Images</Label>
                    <Input
                      id="additionalImages"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setAdditionalImages(Array.from(e.target.files || []))}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? 'Creating Product...' : 'Create Product'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setActiveTab('products')}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <SellerAnalytics sellerId={sellerProfile?._id || sellerProfile?.id} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Account Settings
              </CardTitle>
              <CardDescription>Manage your account preferences and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Profile Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Email Notifications</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">SMS Notifications</span>
                      <Badge variant="secondary">Disabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Auto-approve Orders</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Business Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Shop Status</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Verification Status</span>
                      <Badge variant={sellerProfile?.isVerified || sellerProfile?.is_verified ? "default" : "secondary"}>
                        {sellerProfile?.isVerified || sellerProfile?.is_verified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Commission Rate</span>
                      <span className="text-sm font-medium">5%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex gap-4">
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Update Settings
                </Button>
                <Button variant="outline" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SellerDashboardPage;