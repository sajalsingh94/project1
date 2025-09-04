import React from 'react';
import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface FilterOptions {
  categories: Array<{id: number;name: string;}>;
  dietaryTags: Array<{id: number;name: string;color: string;}>;
  spiceLevels: Array<{id: number;name: string;level: number;}>;
  cities: string[];
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

interface FilterSidebarProps {
  filters: FilterState;
  options: FilterOptions;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  isMobile?: boolean;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  options,
  onFiltersChange,
  onClearFilters,
  isMobile = false
}) => {
  const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Rating' },
  { value: 'delivery_time', label: 'Delivery Time' }];


  const ratingOptions = [
  { value: 4, label: '4★ & above' },
  { value: 4.5, label: '4.5★ & above' }];


  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'categories' | 'dietaryTags' | 'cities', value: any) => {
    const currentArray = filters[key] as any[];
    const newArray = currentArray.includes(value) ?
    currentArray.filter((item) => item !== value) :
    [...currentArray, value];
    updateFilter(key, newArray);
  };

  const hasActiveFilters = () => {
    return (
      filters.categories.length > 0 ||
      filters.dietaryTags.length > 0 ||
      filters.spiceLevel !== undefined ||
      filters.minRating !== undefined ||
      filters.cities.length > 0 ||
      filters.priceRange[0] > 0 || filters.priceRange[1] < 1000);

  };

  const FilterContent = () =>
  <div className="space-y-6">
      {/* Clear Filters */}
      {hasActiveFilters() &&
    <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Active Filters</span>
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear All
          </Button>
        </div>
    }

      {/* Sort Options */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Sort By</Label>
        <RadioGroup value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
          {sortOptions.map((option) =>
        <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`sort-${option.value}`} />
              <Label htmlFor={`sort-${option.value}`} className="text-sm cursor-pointer">
                {option.label}
              </Label>
            </div>
        )}
        </RadioGroup>
      </div>

      <Separator />

      {/* Categories */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Categories</Label>
        {options.categories.map((category) =>
      <div key={category.id} className="flex items-center space-x-2">
            <Checkbox
          id={`category-${category.id}`}
          checked={filters.categories.includes(category.id)}
          onCheckedChange={() => toggleArrayFilter('categories', category.id)} />

            <Label htmlFor={`category-${category.id}`} className="text-sm cursor-pointer">
              {category.name}
            </Label>
          </div>
      )}
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Price Range</Label>
        <div className="px-2">
          <Slider
          value={filters.priceRange}
          onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
          max={1000}
          step={10}
          className="w-full" />

          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>₹{filters.priceRange[0]}</span>
            <span>₹{filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Dietary Tags */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Dietary Preferences</Label>
        {options.dietaryTags.map((tag) =>
      <div key={tag.id} className="flex items-center space-x-2">
            <Checkbox
          id={`dietary-${tag.id}`}
          checked={filters.dietaryTags.includes(tag.id)}
          onCheckedChange={() => toggleArrayFilter('dietaryTags', tag.id)} />

            <Label htmlFor={`dietary-${tag.id}`} className="text-sm cursor-pointer flex items-center">
              <Badge
            style={{ backgroundColor: tag.color }}
            className="text-white text-xs mr-2">

                {tag.name}
              </Badge>
            </Label>
          </div>
      )}
      </div>

      <Separator />

      {/* Spice Level */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Spice Level</Label>
        <RadioGroup
        value={filters.spiceLevel?.toString()}
        onValueChange={(value) => updateFilter('spiceLevel', value ? parseInt(value) : undefined)}>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="" id="spice-any" />
            <Label htmlFor="spice-any" className="text-sm cursor-pointer">Any</Label>
          </div>
          {options.spiceLevels.map((level) =>
        <div key={level.id} className="flex items-center space-x-2">
              <RadioGroupItem value={level.id.toString()} id={`spice-${level.id}`} />
              <Label htmlFor={`spice-${level.id}`} className="text-sm cursor-pointer">
                {level.name} {'🌶️'.repeat(level.level)}
              </Label>
            </div>
        )}
        </RadioGroup>
      </div>

      <Separator />

      {/* Rating */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Rating</Label>
        <RadioGroup
        value={filters.minRating?.toString()}
        onValueChange={(value) => updateFilter('minRating', value ? parseFloat(value) : undefined)}>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="" id="rating-any" />
            <Label htmlFor="rating-any" className="text-sm cursor-pointer">Any Rating</Label>
          </div>
          {ratingOptions.map((option) =>
        <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value.toString()} id={`rating-${option.value}`} />
              <Label htmlFor={`rating-${option.value}`} className="text-sm cursor-pointer">
                {option.label}
              </Label>
            </div>
        )}
        </RadioGroup>
      </div>

      <Separator />

      {/* Availability */}
      <div className="flex items-center space-x-2">
        <Checkbox
        id="in-stock"
        checked={filters.inStock}
        onCheckedChange={(checked) => updateFilter('inStock', checked)} />

        <Label htmlFor="in-stock" className="text-sm cursor-pointer">
          In Stock Only
        </Label>
      </div>

      <Separator />

      {/* Cities */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Seller Location</Label>
        {options.cities.map((city) =>
      <div key={city} className="flex items-center space-x-2">
            <Checkbox
          id={`city-${city}`}
          checked={filters.cities.includes(city)}
          onCheckedChange={() => toggleArrayFilter('cities', city)} />

            <Label htmlFor={`city-${city}`} className="text-sm cursor-pointer">
              {city}
            </Label>
          </div>
      )}
      </div>
    </div>;


  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters() &&
            <Badge className="ml-2 bg-orange-600">
                {filters.categories.length + filters.dietaryTags.length + filters.cities.length + (
              filters.spiceLevel ? 1 : 0) + (filters.minRating ? 1 : 0)}
              </Badge>
            }
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>);

  }

  return (
    <div className="w-64 bg-white p-6 border-r">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Filter className="w-5 h-5 mr-2" />
        Filters
      </h3>
      <FilterContent />
    </div>);

};

export default FilterSidebar;