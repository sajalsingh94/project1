import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import HeroBanner from '@/components/HeroBanner';
import CategoryStrip from '@/components/CategoryStrip';
import SearchBar from '@/components/SearchBar';
import FilterSidebar from '@/components/FilterSidebar';
import ProductCard from '@/components/ProductCard';
import SpecialSections from '@/components/SpecialSections';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Grid, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

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
  is_featured: boolean;
  is_bestseller: boolean;
}

interface Category {
  id: number;
  name: string;
  description: string;
  image_url: string;
}

interface FilterState {
  categories: number[];
  priceRange: [number, number];
  dietaryTags: number[];
  spiceLevel?: number;
  minRating?: number;
  inStock: boolean;
  cities: string[];
  sortBy: string;
}

const INITIAL_FILTERS: FilterState = {
  categories: [],
  priceRange: [0, 1000],
  dietaryTags: [],
  spiceLevel: undefined,
  minRating: undefined,
  inStock: false,
  cities: [],
  sortBy: 'relevance'
};

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [highlyRatedProducts, setHighlyRatedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dietaryTags, setDietaryTags] = useState<any[]>([]);
  const [spiceLevels, setSpiceLevels] = useState<any[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const isMobile = useIsMobile();
  const { toast } = useToast();
  const pageSize = 12;

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchQuery, filters, currentPage]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);

      // Load categories
      const { data: categoriesData } = await window.ezsite.apis.tablePage(39097, {
        PageNo: 1,
        PageSize: 20
      });

      // Load dietary tags
      const { data: dietaryTagsData } = await window.ezsite.apis.tablePage(39098, {
        PageNo: 1,
        PageSize: 20
      });

      // Load spice levels
      const { data: spiceLevelsData } = await window.ezsite.apis.tablePage(39099, {
        PageNo: 1,
        PageSize: 10
      });

      // Load unique cities from sellers
      const { data: sellersData } = await window.ezsite.apis.tablePage(39101, {
        PageNo: 1,
        PageSize: 100
      });

      if (categoriesData?.List) setCategories(categoriesData.List);
      if (dietaryTagsData?.List) setDietaryTags(dietaryTagsData.List);
      if (spiceLevelsData?.List) setSpiceLevels(spiceLevelsData.List);
      if (sellersData?.List) {
        const uniqueCities = [...new Set(sellersData.List.map((seller: any) => seller.city))];
        setCities(uniqueCities.filter(Boolean));
      }

      // Load special sections
      await loadSpecialSections();
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast({
        title: "Error",
        description: "Failed to load page data. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadSpecialSections = async () => {
    try {
      // Load trending (featured products)
      const { data: trendingData } = await window.ezsite.apis.tablePage(39102, {
        PageNo: 1,
        PageSize: 8,
        OrderByField: "rating",
        IsAsc: false,
        Filters: [{ name: "is_featured", op: "Equal", value: true }]
      });

      // Load new products (recent additions)
      const { data: newData } = await window.ezsite.apis.tablePage(39102, {
        PageNo: 1,
        PageSize: 8,
        OrderByField: "id",
        IsAsc: false
      });

      // Load highly rated
      const { data: ratedData } = await window.ezsite.apis.tablePage(39102, {
        PageNo: 1,
        PageSize: 8,
        OrderByField: "rating",
        IsAsc: false,
        Filters: [{ name: "rating", op: "GreaterThanOrEqual", value: 4.5 }]
      });

      if (trendingData?.List) setTrendingProducts(trendingData.List);
      if (newData?.List) setNewProducts(newData.List);
      if (ratedData?.List) setHighlyRatedProducts(ratedData.List);
    } catch (error) {
      console.error('Error loading special sections:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setIsLoading(true);

      const apiFilters = [];

      // Category filter
      if (selectedCategory) {
        apiFilters.push({ name: "category_id", op: "Equal", value: selectedCategory });
      }

      // Search query
      if (searchQuery.trim()) {
        apiFilters.push({ name: "name", op: "StringContains", value: searchQuery.trim() });
      }

      // Price range
      if (filters.priceRange[0] > 0) {
        apiFilters.push({ name: "price", op: "GreaterThanOrEqual", value: filters.priceRange[0] });
      }
      if (filters.priceRange[1] < 1000) {
        apiFilters.push({ name: "price", op: "LessThanOrEqual", value: filters.priceRange[1] });
      }

      // Spice level
      if (filters.spiceLevel) {
        apiFilters.push({ name: "spice_level_id", op: "Equal", value: filters.spiceLevel });
      }

      // Rating
      if (filters.minRating) {
        apiFilters.push({ name: "rating", op: "GreaterThanOrEqual", value: filters.minRating });
      }

      // Stock availability
      if (filters.inStock) {
        apiFilters.push({ name: "stock_quantity", op: "GreaterThan", value: 0 });
      }

      // Sort order
      let orderByField = "id";
      let isAsc = false;

      switch (filters.sortBy) {
        case 'price_low':
          orderByField = "price";
          isAsc = true;
          break;
        case 'price_high':
          orderByField = "price";
          isAsc = false;
          break;
        case 'rating':
          orderByField = "rating";
          isAsc = false;
          break;
        case 'newest':
          orderByField = "id";
          isAsc = false;
          break;
        default:
          orderByField = "rating";
          isAsc = false;
      }

      const { data: productsData } = await window.ezsite.apis.tablePage(39102, {
        PageNo: currentPage,
        PageSize: pageSize,
        OrderByField: orderByField,
        IsAsc: isAsc,
        Filters: apiFilters
      });

      if (productsData?.List) {
        // Enrich products with seller and category data
        const enrichedProducts = await Promise.all(
          productsData.List.map(async (product: any) => {
            try {
              // Get seller info
              const { data: sellerData } = await window.ezsite.apis.tablePage(39101, {
                PageNo: 1,
                PageSize: 1,
                Filters: [{ name: "id", op: "Equal", value: product.seller_id }]
              });

              // Get category info
              const { data: categoryData } = await window.ezsite.apis.tablePage(39097, {
                PageNo: 1,
                PageSize: 1,
                Filters: [{ name: "id", op: "Equal", value: product.category_id }]
              });

              return {
                ...product,
                seller_name: sellerData?.List?.[0]?.business_name,
                category_name: categoryData?.List?.[0]?.name
              };
            } catch {
              return product;
            }
          })
        );

        setProducts(enrichedProducts);
        setTotalPages(Math.ceil((productsData.VirtualCount || 0) / pageSize));
      }
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCategorySelect = (categoryId: number | undefined) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSelectedCategory(undefined);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleAddToCart = async (productId: number) => {
    // Mock implementation - replace with real cart logic
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log('Added to cart:', productId);
  };

  const handleToggleWishlist = async (productId: number) => {
    // Mock implementation - replace with real wishlist logic
    await new Promise((resolve) => setTimeout(resolve, 300));
    setWishlist((prev) =>
    prev.includes(productId) ?
    prev.filter((id) => id !== productId) :
    [...prev, productId]
    );
  };

  const handleQuickView = (product: Product) => {
    // Mock implementation - you can implement a modal or navigate to product detail
    console.log('Quick view:', product);
  };

  const isInWishlist = (productId: number) => wishlist.includes(productId);

  const filterOptions = {
    categories,
    dietaryTags,
    spiceLevels,
    cities
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p>Loading amazing Bihari delicacies...</p>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Authentic Bihari Snacks & Sweets - From Local Kitchens to Your Doorstep"
        description="Discover authentic Bihari delicacies, traditional sweets, spicy snacks, and homemade specialties from verified local sellers across Bihar."
        keywords="Bihari snacks, Bihar sweets, traditional food, local delicacies, authentic Bihar cuisine, homemade food" />


      {/* Hero Banner */}
      <HeroBanner />

      {/* Category Strip */}
      <CategoryStrip
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect} />


      {/* Search Bar */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar Filters */}
        {!isMobile &&
        <FilterSidebar
          filters={filters}
          options={filterOptions}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters} />

        }

        {/* Products Section */}
        <div className="flex-1">
          <div className="container mx-auto px-4 py-8">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {searchQuery ? `Search results for "${searchQuery}"` :
                  selectedCategory ? `${categories.find((c) => c.id === selectedCategory)?.name || 'Products'}` :
                  'All Products'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {products.length > 0 ? `${products.length} products found` : 'No products found'}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Mobile Filter Button */}
                {isMobile &&
                <FilterSidebar
                  filters={filters}
                  options={filterOptions}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                  isMobile={true} />

                }
                
                {/* View Toggle */}
                <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="p-2">

                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="p-2">

                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ?
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) =>
              <div key={i} className="animate-pulse">
                    <div className="bg-gray-300 aspect-square rounded-lg mb-4"></div>
                    <div className="space-y-2">
                      <div className="bg-gray-300 h-4 rounded"></div>
                      <div className="bg-gray-300 h-4 w-3/4 rounded"></div>
                      <div className="bg-gray-300 h-6 w-1/2 rounded"></div>
                    </div>
                  </div>
              )}
              </div> :
            products.length > 0 ?
            <div className={
            viewMode === 'grid' ?
            'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' :
            'space-y-4'
            }>
                {products.map((product) =>
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                onQuickView={handleQuickView}
                isInWishlist={isInWishlist(product.id)} />

              )}
              </div> :

            <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={handleClearFilters} variant="outline">
                  Clear all filters
                </Button>
              </div>
            }

            {/* Pagination */}
            {totalPages > 1 &&
            <div className="flex justify-center items-center space-x-2 mt-8">
                <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}>

                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = currentPage <= 3 ?
                  i + 1 :
                  currentPage >= totalPages - 2 ?
                  totalPages - 4 + i :
                  currentPage - 2 + i;

                  if (pageNum < 1 || pageNum > totalPages) return null;

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}>

                        {pageNum}
                      </Button>);

                })}
                </div>
                
                <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}>

                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            }
          </div>
        </div>
      </div>

      {/* Special Sections */}
      <SpecialSections
        trendingProducts={trendingProducts}
        newProducts={newProducts}
        highlyRatedProducts={highlyRatedProducts}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        onQuickView={handleQuickView}
        isInWishlist={isInWishlist} />

    </div>);

}