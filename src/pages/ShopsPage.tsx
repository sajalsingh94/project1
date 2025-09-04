import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import SEOHead from '@/components/SEOHead';
import SellerCard from '@/components/SellerCard';
import { useToast } from '@/hooks/use-toast';
import { sampleSellers } from '@/utils/createSellerSamples';

interface Seller {
  id: number;
  business_name: string;
  owner_name: string;
  description: string;
  city: string;
  state: string;
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  specialties: string;
  established_year: number;
  profile_image?: string;
}

interface FilterState {
  city: string;
  specialties: string[];
  rating4Plus: boolean;
  deliveryTime: string;
  priceBand: string;
  sortBy: string;
}

const ShopsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [filters, setFilters] = useState<FilterState>({
    city: '',
    specialties: [],
    rating4Plus: false,
    deliveryTime: '',
    priceBand: '',
    sortBy: 'alphabetical'
  });

  const cities = ['All Cities', 'Madhubani', 'Patna', 'Sitamarhi', 'Darbhanga', 'Samastipur', 'Muzaffarpur'];
  const allSpecialties = ['Litti Chokha', 'Tilkut', 'Khaja', 'Makhana', 'Sattu', 'Ghugni', 'Kheer', 'Papad'];
  const deliveryTimes = ['All Times', 'Under 30 mins', '30-60 mins', '1-2 hours'];
  const priceBands = ['All Prices', 'Budget (Under ₹200)', 'Medium (₹200-₹500)', 'Premium (₹500+)'];

  useEffect(() => {
    fetchSellers();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [sellers, filters, searchQuery]);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await window.ezsite.apis.tablePage(39101, {
        PageNo: 1,
        PageSize: 50,
        OrderByField: "rating",
        IsAsc: false
      });

      if (response.error) throw response.error;

      let sellersList = response.data.List;

      // If no sellers in database, create sample data
      if (sellersList.length === 0) {
        // Create sample sellers
        for (const sampleSeller of sampleSellers) {
          const createResponse = await window.ezsite.apis.tableCreate(39101, sampleSeller);
          if (createResponse.error) {
            console.error('Error creating sample seller:', createResponse.error);
          }
        }

        // Fetch again after creating samples
        const secondResponse = await window.ezsite.apis.tablePage(39101, {
          PageNo: 1,
          PageSize: 50,
          OrderByField: "rating",
          IsAsc: false
        });

        if (!secondResponse.error) {
          sellersList = secondResponse.data.List;
        }
      }

      setSellers(sellersList);
    } catch (error) {
      console.error('Error fetching sellers:', error);
      toast({ title: "Failed to load sellers", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...sellers];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((seller) =>
      seller.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.specialties.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply city filter
    if (filters.city && filters.city !== 'All Cities') {
      filtered = filtered.filter((seller) => seller.city === filters.city);
    }

    // Apply specialties filter
    if (filters.specialties.length > 0) {
      filtered = filtered.filter((seller) =>
      filters.specialties.some((specialty) =>
      seller.specialties.toLowerCase().includes(specialty.toLowerCase())
      )
      );
    }

    // Apply rating filter
    if (filters.rating4Plus) {
      filtered = filtered.filter((seller) => seller.rating >= 4.0);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'alphabetical':
        filtered.sort((a, b) => a.business_name.localeCompare(b.business_name));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.established_year - a.established_year);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.total_reviews - a.total_reviews);
        break;
    }

    setFilteredSellers(filtered);
  };

  const toggleSpecialty = (specialty: string) => {
    setFilters((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty) ?
      prev.specialties.filter((s) => s !== specialty) :
      [...prev.specialties, specialty]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      city: '',
      specialties: [],
      rating4Plus: false,
      deliveryTime: '',
      priceBand: '',
      sortBy: 'alphabetical'
    });
    setSearchQuery('');
  };

  const FilterContent = () =>
  <div className="space-y-6">
      {/* City Filter */}
      <div>
        <h3 className="font-medium mb-3">City</h3>
        <Select value={filters.city} onValueChange={(value) => setFilters((prev) => ({ ...prev, city: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) =>
          <SelectItem key={city} value={city}>{city}</SelectItem>
          )}
          </SelectContent>
        </Select>
      </div>

      {/* Specialties Filter */}
      <div>
        <h3 className="font-medium mb-3">Specialties</h3>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {allSpecialties.map((specialty) =>
        <div key={specialty} className="flex items-center space-x-2">
              <Checkbox
            id={specialty}
            checked={filters.specialties.includes(specialty)}
            onCheckedChange={() => toggleSpecialty(specialty)} />

              <label htmlFor={specialty} className="text-sm">{specialty}</label>
            </div>
        )}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <div className="flex items-center space-x-2">
          <Checkbox
          id="rating4plus"
          checked={filters.rating4Plus}
          onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, rating4Plus: !!checked }))} />

          <label htmlFor="rating4plus" className="text-sm flex items-center">
            4+ <Star className="w-3 h-3 ml-1 text-yellow-500 fill-current" /> Only
          </label>
        </div>
      </div>

      {/* Delivery Time Filter */}
      <div>
        <h3 className="font-medium mb-3">Delivery Time</h3>
        <Select value={filters.deliveryTime} onValueChange={(value) => setFilters((prev) => ({ ...prev, deliveryTime: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Any time" />
          </SelectTrigger>
          <SelectContent>
            {deliveryTimes.map((time) =>
          <SelectItem key={time} value={time}>{time}</SelectItem>
          )}
          </SelectContent>
        </Select>
      </div>

      {/* Price Band Filter */}
      <div>
        <h3 className="font-medium mb-3">Price Range</h3>
        <Select value={filters.priceBand} onValueChange={(value) => setFilters((prev) => ({ ...prev, priceBand: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Any price" />
          </SelectTrigger>
          <SelectContent>
            {priceBands.map((band) =>
          <SelectItem key={band} value={band}>{band}</SelectItem>
          )}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <Button variant="outline" onClick={clearAllFilters} className="w-full">
        Clear All Filters
      </Button>
    </div>;


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-red-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) =>
              <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
              )}
            </div>
          </div>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-red-50">
      <SEOHead
        title="Seller Directory - Mithila Bites"
        description="Discover authentic Mithila food sellers and shops. Browse by location, specialties, and ratings to find the perfect traditional Bihar delicacies." />

      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mithila <span className="text-orange-600">Sellers</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover authentic sellers bringing traditional Mithila flavors directly to your doorstep
          </p>
        </div>

        {/* Search and Sort Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search sellers, specialties, or cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12" />

          </div>
          
          <div className="flex gap-2">
            <Select value={filters.sortBy} onValueChange={(value) => setFilters((prev) => ({ ...prev, sortBy: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="newest">Newest Seller</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {filteredSellers.length} seller{filteredSellers.length !== 1 ? 's' : ''} found
          </p>
          <div className="hidden md:block">
            <Badge variant="outline" className="text-sm">
              <MapPin className="w-3 h-3 mr-1" />
              Bihar, India
            </Badge>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <Card className="p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4" />
                <h2 className="font-semibold">Filters</h2>
              </div>
              <FilterContent />
            </Card>
          </div>

          {/* Sellers Grid */}
          <div className="flex-1">
            {filteredSellers.length === 0 ?
            <Card className="p-12 text-center">
                <p className="text-gray-500 mb-4">No sellers found matching your criteria.</p>
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear Filters
                </Button>
              </Card> :

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSellers.map((seller) =>
              <SellerCard key={seller.id} seller={seller} />
              )}
              </div>
            }
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Want to Join Our Network?</h2>
          <p className="text-gray-600 mb-6">
            Are you a seller of authentic Mithila foods? Join our growing community of trusted partners.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
            Become a Partner
          </Button>
        </div>
      </div>
    </div>);

};

export default ShopsPage;