import React from 'react';
import { ArrowUpDown, Calendar, Star, ChefHat } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export interface SortOption {
  value: string;
  label: string;
  field: string;
  order: 'asc' | 'desc';
  icon: React.ElementType;
}

interface RecipeSortProps {
  currentSort: string;
  onSortChange: (sortValue: string) => void;
}

const RecipeSort: React.FC<RecipeSortProps> = ({
  currentSort,
  onSortChange
}) => {
  const sortOptions: SortOption[] = [
  {
    value: 'newest',
    label: 'Newest First',
    field: 'created_date',
    order: 'desc',
    icon: Calendar
  },
  {
    value: 'rating',
    label: 'Highest Rated',
    field: 'rating',
    order: 'desc',
    icon: Star
  },
  {
    value: 'most_cooked',
    label: 'Most Cooked',
    field: 'cooked_count',
    order: 'desc',
    icon: ChefHat
  },
  {
    value: 'quick_first',
    label: 'Quick & Easy',
    field: 'prep_time',
    order: 'asc',
    icon: ArrowUpDown
  },
  {
    value: 'name_asc',
    label: 'Name A-Z',
    field: 'name',
    order: 'asc',
    icon: ArrowUpDown
  }];


  const getCurrentSortOption = () => {
    return sortOptions.find((option) => option.value === currentSort) || sortOptions[0];
  };

  return (
    <div className="flex items-center gap-4">
      {/* Desktop Sort */}
      <div className="hidden md:flex items-center gap-2">
        <ArrowUpDown className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-600">Sort by:</span>
        <Select value={currentSort} onValueChange={onSortChange}>
          <SelectTrigger className="w-48">
            <SelectValue>
              <div className="flex items-center gap-2">
                {React.createElement(getCurrentSortOption().icon, {
                  className: "h-4 w-4"
                })}
                {getCurrentSortOption().label}
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) =>
            <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <option.icon className="h-4 w-4" />
                  {option.label}
                </div>
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Mobile Sort */}
      <div className="md:hidden">
        <Select value={currentSort} onValueChange={onSortChange}>
          <SelectTrigger className="w-40">
            <SelectValue>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                <span className="hidden sm:inline">Sort</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) =>
            <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <option.icon className="h-4 w-4" />
                  <span className="text-sm">{option.label}</span>
                </div>
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>);

};

export default RecipeSort;
export { type SortOption };