import React from 'react';
import { Filter, Clock, ChefHat, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface FilterState {
  categories: string[];
  difficulties: string[];
  timeRange: string;
  dietaryTags: string[];
}

interface RecipeFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableCategories: string[];
  availableDietaryTags: Array<{id: number;name: string;color: string;}>;
  activeFiltersCount: number;
}

const RecipeFilters: React.FC<RecipeFiltersProps> = ({
  filters,
  onFiltersChange,
  availableCategories,
  availableDietaryTags,
  activeFiltersCount
}) => {
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const timeRanges = [
  { value: 'all', label: 'Any Time' },
  { value: '30', label: '≤ 30 minutes' },
  { value: '60', label: '≤ 60 minutes' },
  { value: '90', label: '≤ 90 minutes' }];


  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked ?
    [...filters.categories, category] :
    filters.categories.filter((c) => c !== category);

    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleDifficultyChange = (difficulty: string, checked: boolean) => {
    const newDifficulties = checked ?
    [...filters.difficulties, difficulty] :
    filters.difficulties.filter((d) => d !== difficulty);

    onFiltersChange({ ...filters, difficulties: newDifficulties });
  };

  const handleTimeRangeChange = (timeRange: string) => {
    onFiltersChange({ ...filters, timeRange });
  };

  const handleDietaryTagChange = (tagName: string, checked: boolean) => {
    const newDietaryTags = checked ?
    [...filters.dietaryTags, tagName] :
    filters.dietaryTags.filter((t) => t !== tagName);

    onFiltersChange({ ...filters, dietaryTags: newDietaryTags });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      difficulties: [],
      timeRange: 'all',
      dietaryTags: []
    });
  };

  const FilterSection = ({ icon: Icon, title, children



  }: {icon: React.ElementType;title: string;children: React.ReactNode;}) =>
  <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-orange-600" />
        <h3 className="font-medium text-sm">{title}</h3>
      </div>
      {children}
      <Separator />
    </div>;


  const FilterContent = () =>
  <div className="space-y-6">
      {/* Categories */}
      <FilterSection icon={Utensils} title="Category">
        <div className="space-y-2">
          {availableCategories.map((category) =>
        <div key={category} className="flex items-center space-x-2">
              <Checkbox
            id={`category-${category}`}
            checked={filters.categories.includes(category)}
            onCheckedChange={(checked) =>
            handleCategoryChange(category, checked as boolean)
            } />

              <Label
            htmlFor={`category-${category}`}
            className="text-sm font-normal cursor-pointer">

                {category}
              </Label>
            </div>
        )}
        </div>
      </FilterSection>

      {/* Difficulty */}
      <FilterSection icon={ChefHat} title="Difficulty">
        <div className="space-y-2">
          {difficulties.map((difficulty) =>
        <div key={difficulty} className="flex items-center space-x-2">
              <Checkbox
            id={`difficulty-${difficulty}`}
            checked={filters.difficulties.includes(difficulty)}
            onCheckedChange={(checked) =>
            handleDifficultyChange(difficulty, checked as boolean)
            } />

              <Label
            htmlFor={`difficulty-${difficulty}`}
            className="text-sm font-normal cursor-pointer">

                {difficulty}
              </Label>
            </div>
        )}
        </div>
      </FilterSection>

      {/* Cooking Time */}
      <FilterSection icon={Clock} title="Cooking Time">
        <RadioGroup
        value={filters.timeRange}
        onValueChange={handleTimeRangeChange}
        className="space-y-2">

          {timeRanges.map((range) =>
        <div key={range.value} className="flex items-center space-x-2">
              <RadioGroupItem value={range.value} id={`time-${range.value}`} />
              <Label
            htmlFor={`time-${range.value}`}
            className="text-sm font-normal cursor-pointer">

                {range.label}
              </Label>
            </div>
        )}
        </RadioGroup>
      </FilterSection>

      {/* Dietary Tags */}
      {availableDietaryTags.length > 0 &&
    <FilterSection icon={Utensils} title="Dietary Preferences">
          <div className="space-y-2">
            {availableDietaryTags.map((tag) =>
        <div key={tag.id} className="flex items-center space-x-2">
                <Checkbox
            id={`dietary-${tag.id}`}
            checked={filters.dietaryTags.includes(tag.name)}
            onCheckedChange={(checked) =>
            handleDietaryTagChange(tag.name, checked as boolean)
            } />

                <Label
            htmlFor={`dietary-${tag.id}`}
            className="text-sm font-normal cursor-pointer">

                  <Badge
              variant="outline"
              style={{ borderColor: tag.color, color: tag.color }}
              className="text-xs">

                    {tag.name}
                  </Badge>
                </Label>
              </div>
        )}
          </div>
        </FilterSection>
    }

      {/* Clear All */}
      {activeFiltersCount > 0 &&
    <Button
      variant="outline"
      onClick={clearAllFilters}
      className="w-full">

          Clear All Filters
        </Button>
    }
    </div>;


  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block w-80 p-6 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-orange-600" />
            <h2 className="font-semibold">Filters</h2>
          </div>
          {activeFiltersCount > 0 &&
          <Badge variant="secondary">{activeFiltersCount}</Badge>
          }
        </div>
        <FilterContent />
      </div>

      {/* Mobile Filter Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 &&
              <Badge
                variant="secondary"
                className="ml-2 px-1.5 py-0.5 text-xs">

                  {activeFiltersCount}
                </Badge>
              }
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-orange-600" />
                Recipe Filters
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>);

};

export default RecipeFilters;