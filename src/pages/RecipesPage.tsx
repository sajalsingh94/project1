import React, { useState, useEffect, useMemo } from 'react';
import { Search, Grid, List, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEOHead from '@/components/SEOHead';
import RecipeCard from '@/components/RecipeCard';
import RecipeFilters from '@/components/RecipeFilters';
import RecipeSort from '@/components/RecipeSort';
import { useToast } from '@/hooks/use-toast';

interface Recipe {
  id: number;
  name: string;
  short_teaser: string;
  contributor_name: string;
  contributor_type: string;
  prep_time: number;
  cook_time: number;
  difficulty_level: string;
  rating: number;
  rating_count: number;
  main_image: string;
  category: string;
  cooked_count: number;
  created_date: string;
}

interface DietaryTag {
  id: number;
  name: string;
  color: string;
}

interface RecipeDietaryTag {
  id: number;
  recipe_id: number;
  dietary_tag_id: number;
}

interface FilterState {
  categories: string[];
  difficulties: string[];
  timeRange: string;
  dietaryTags: string[];
}

const RecipesPage: React.FC = () => {
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [dietaryTags, setDietaryTags] = useState<DietaryTag[]>([]);
  const [recipeDietaryTags, setRecipeDietaryTags] = useState<RecipeDietaryTag[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSort, setCurrentSort] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    difficulties: [],
    timeRange: 'all',
    dietaryTags: []
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch recipes
        const recipesResponse = await window.ezsite.apis.tablePage(39103, {
          PageNo: 1,
          PageSize: 100,
          OrderByField: 'created_date',
          IsAsc: false,
          Filters: []
        });

        if (recipesResponse.error) throw recipesResponse.error;

        // Fetch dietary tags
        const tagsResponse = await window.ezsite.apis.tablePage(39098, {
          PageNo: 1,
          PageSize: 50,
          OrderByField: 'name',
          IsAsc: true,
          Filters: []
        });

        if (tagsResponse.error) throw tagsResponse.error;

        // Fetch recipe dietary tags relationships
        const recipeTagsResponse = await window.ezsite.apis.tablePage(39105, {
          PageNo: 1,
          PageSize: 500,
          OrderByField: 'id',
          IsAsc: true,
          Filters: []
        });

        if (recipeTagsResponse.error) throw recipeTagsResponse.error;

        setRecipes(recipesResponse.data?.List || []);
        setDietaryTags(tagsResponse.data?.List || []);
        setRecipeDietaryTags(recipeTagsResponse.data?.List || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load recipes. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Get unique categories from recipes
  const availableCategories = useMemo(() => {
    const categories = recipes.map((recipe) => recipe.category).filter(Boolean);
    return [...new Set(categories)].sort();
  }, [recipes]);

  // Get dietary tags for a recipe
  const getRecipeDietaryTags = (recipeId: number): DietaryTag[] => {
    const recipeTagIds = recipeDietaryTags.
    filter((rt) => rt.recipe_id === recipeId).
    map((rt) => rt.dietary_tag_id);

    return dietaryTags.filter((tag) => recipeTagIds.includes(tag.id));
  };

  // Filter and sort recipes
  const filteredAndSortedRecipes = useMemo(() => {
    let filtered = recipes.filter((recipe) => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesSearch =
        recipe.name.toLowerCase().includes(search) ||
        recipe.short_teaser.toLowerCase().includes(search) ||
        recipe.contributor_name.toLowerCase().includes(search) ||
        recipe.category.toLowerCase().includes(search);

        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(recipe.category)) {
        return false;
      }

      // Difficulty filter
      if (filters.difficulties.length > 0 && !filters.difficulties.includes(recipe.difficulty_level)) {
        return false;
      }

      // Time filter
      if (filters.timeRange !== 'all') {
        const totalTime = recipe.prep_time + recipe.cook_time;
        const maxTime = parseInt(filters.timeRange);
        if (totalTime > maxTime) return false;
      }

      // Dietary tags filter
      if (filters.dietaryTags.length > 0) {
        const recipeTags = getRecipeDietaryTags(recipe.id);
        const recipeTagNames = recipeTags.map((tag) => tag.name);
        const hasMatchingTag = filters.dietaryTags.some((filterTag) =>
        recipeTagNames.includes(filterTag)
        );
        if (!hasMatchingTag) return false;
      }

      return true;
    });

    // Sort recipes
    const sortOptions = {
      newest: (a: Recipe, b: Recipe) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime(),
      rating: (a: Recipe, b: Recipe) => b.rating - a.rating,
      most_cooked: (a: Recipe, b: Recipe) => b.cooked_count - a.cooked_count,
      quick_first: (a: Recipe, b: Recipe) => a.prep_time + a.cook_time - (b.prep_time + b.cook_time),
      name_asc: (a: Recipe, b: Recipe) => a.name.localeCompare(b.name)
    };

    return filtered.sort(sortOptions[currentSort as keyof typeof sortOptions] || sortOptions.newest);
  }, [recipes, searchTerm, filters, currentSort, recipeDietaryTags, dietaryTags]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length > 0) count += filters.categories.length;
    if (filters.difficulties.length > 0) count += filters.difficulties.length;
    if (filters.timeRange !== 'all') count += 1;
    if (filters.dietaryTags.length > 0) count += filters.dietaryTags.length;
    return count;
  }, [filters]);

  const handleFavoriteToggle = (recipeId: number) => {
    setFavorites((prev) =>
    prev.includes(recipeId) ?
    prev.filter((id) => id !== recipeId) :
    [...prev, recipeId]
    );

    toast({
      title: favorites.includes(recipeId) ? 'Removed from favorites' : 'Added to favorites',
      description: favorites.includes(recipeId) ?
      'Recipe removed from your favorites.' :
      'Recipe added to your favorites.'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading delicious recipes...</p>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Traditional Bihar Recipes"
        description="Discover authentic Bihar recipes with step-by-step instructions. From traditional dishes to modern takes on classics." />


      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-gray-900 mb-4">
              Traditional Bihar Recipes
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover authentic flavors and time-honored cooking techniques from Bihar's rich culinary heritage.
            </p>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search recipes, ingredients, or contributors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10" />

            </div>

            <div className="flex items-center gap-4">
              <RecipeSort
                currentSort={currentSort}
                onSortChange={setCurrentSort} />
              
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}>

                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}>

                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <RecipeFilters
            filters={filters}
            onFiltersChange={setFilters}
            availableCategories={availableCategories}
            availableDietaryTags={dietaryTags}
            activeFiltersCount={activeFiltersCount} />


          {/* Recipes Grid */}
          <div className="flex-1">
            {/* Results Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <p className="text-gray-600">
                  <span className="font-medium">{filteredAndSortedRecipes.length}</span> recipes found
                </p>
                {activeFiltersCount > 0 &&
                <Badge variant="secondary">
                    {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} applied
                  </Badge>
                }
              </div>
            </div>

            {/* Recipes Grid/List */}
            {filteredAndSortedRecipes.length === 0 ?
            <Card className="p-12 text-center">
                <div className="text-gray-500">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No recipes found</h3>
                  <p>Try adjusting your search or filters to find more recipes.</p>
                </div>
              </Card> :

            <div className={`grid gap-6 ${
            viewMode === 'grid' ?
            'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' :
            'grid-cols-1'}`
            }>
                {filteredAndSortedRecipes.map((recipe) =>
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                dietaryTags={getRecipeDietaryTags(recipe.id)}
                onFavoriteToggle={handleFavoriteToggle}
                isFavorite={favorites.includes(recipe.id)} />

              )}
              </div>
            }
          </div>
        </div>
      </div>
    </div>);

};

export default RecipesPage;