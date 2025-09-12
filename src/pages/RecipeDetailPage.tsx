import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock, ChefHat, Users, Star, Heart, ArrowLeft,
  ShoppingCart, Play, Printer, Share2 } from
'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SEOHead from '@/components/SEOHead';
import ProductCard from '@/components/ProductCard';
import { useToast } from '@/hooks/use-toast';

interface Recipe {
  id: number;
  name: string;
  description: string;
  short_teaser: string;
  ingredients: string;
  instructions: string;
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
  servings: number;
  tips: string;
  nutrition_info: string;
  video_url: string;
  region: string;
  is_featured: boolean;
}

interface RecipeStep {
  id: number;
  recipe_id: number;
  step_number: number;
  instruction: string;
  image_url: string;
  time_minutes: number;
}

interface DietaryTag {
  id: number;
  name: string;
  color: string;
}

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
  stock_quantity: number;
}

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{id: string;}>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipeSteps, setRecipeSteps] = useState<RecipeStep[]>([]);
  const [dietaryTags, setDietaryTags] = useState<DietaryTag[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentServings, setCurrentServings] = useState(4);

  useEffect(() => {
    if (!id) return;

    const fetchRecipeData = async () => {
      try {
        setLoading(true);

        // Fetch recipe details
        const recipeResponse = await window.ezsite.apis.tablePage(39103, {
          PageNo: 1,
          PageSize: 1,
          OrderByField: 'id',
          IsAsc: true,
          Filters: [{ name: 'id', op: 'Equal', value: parseInt(id) }]
        });

        if (recipeResponse.error) throw recipeResponse.error;

        const recipeData = recipeResponse.data?.List?.[0];
        if (!recipeData) {
          navigate('/recipes');
          return;
        }

        setRecipe(recipeData);
        setCurrentServings(recipeData.servings || 4);

        // Fetch recipe steps
        const stepsResponse = await window.ezsite.apis.tablePage(39112, {
          PageNo: 1,
          PageSize: 50,
          OrderByField: 'step_number',
          IsAsc: true,
          Filters: [{ name: 'recipe_id', op: 'Equal', value: parseInt(id) }]
        });

        if (!stepsResponse.error) {
          setRecipeSteps(stepsResponse.data?.List || []);
        }

        // Fetch dietary tags for this recipe
        const recipeTagsResponse = await window.ezsite.apis.tablePage(39105, {
          PageNo: 1,
          PageSize: 10,
          OrderByField: 'id',
          IsAsc: true,
          Filters: [{ name: 'recipe_id', op: 'Equal', value: parseInt(id) }]
        });

        if (!recipeTagsResponse.error) {
          const tagIds = recipeTagsResponse.data?.List?.map((rt: any) => rt.dietary_tag_id) || [];

          if (tagIds.length > 0) {
            const tagsResponse = await window.ezsite.apis.tablePage(39098, {
              PageNo: 1,
              PageSize: 10,
              OrderByField: 'name',
              IsAsc: true,
              Filters: tagIds.map((tagId) => ({ name: 'id', op: 'Equal', value: tagId }))
            });

            if (!tagsResponse.error) {
              setDietaryTags(tagsResponse.data?.List || []);
            }
          }
        }

        // Fetch related products (based on recipe ingredients/category)
        const productsResponse = await window.ezsite.apis.tablePage(39102, {
          PageNo: 1,
          PageSize: 8,
          OrderByField: 'rating',
          IsAsc: false,
          Filters: []
        });

        if (!productsResponse.error) {
          setRelatedProducts(productsResponse.data?.List || []);
        }

      } catch (error) {
        console.error('Error fetching recipe:', error);
        toast({
          title: 'Error',
          description: 'Failed to load recipe details.',
          variant: 'destructive'
        });
        navigate('/recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeData();
  }, [id, navigate, toast]);

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? 'Removed from favorites' : 'Added to favorites',
      description: isFavorite ?
      'Recipe removed from your favorites.' :
      'Recipe added to your favorites.'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe?.name,
          text: recipe?.short_teaser,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied!',
        description: 'Recipe link copied to clipboard.'
      });
    }
  };

  const adjustServings = (newServings: number) => {
    if (newServings < 1 || newServings > 20) return;
    setCurrentServings(newServings);
  };

  const getServingMultiplier = () => {
    return recipe ? currentServings / recipe.servings : 1;
  };

  const formatIngredients = (ingredients: string) => {
    if (!ingredients) return [];

    // Split by lines and filter out empty lines
    return ingredients.split('\n').filter((line) => line.trim()).map((line) => line.trim());
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':return 'bg-green-100 text-green-800';
      case 'medium':return 'bg-yellow-100 text-yellow-800';
      case 'hard':return 'bg-red-100 text-red-800';
      default:return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || !recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p>Loading recipe...</p>
        </div>
      </div>);

  }

  const totalTime = recipe.prep_time + recipe.cook_time;

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={`${recipe.name} - Bihar Recipe`}
        description={recipe.short_teaser || recipe.description} />


      {/* Hero Section */}
      <div className="relative">
        <div className="h-96 md:h-[500px] overflow-hidden">
          <img
            src={recipe.main_image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80'}
            alt={recipe.name}
            className="w-full h-full object-cover" />

          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>

        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/recipes')}
          className="absolute top-4 left-4 bg-white/90 hover:bg-white text-gray-900">

          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Recipes
        </Button>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavoriteToggle}
            className="bg-white/90 hover:bg-white text-gray-900">

            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="bg-white/90 hover:bg-white text-gray-900">

            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Recipe Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black via-black/70 to-transparent">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-orange-600 text-white">
                {recipe.category}
              </Badge>
              {dietaryTags.map((tag) =>
              <Badge
                key={tag.id}
                variant="outline"
                className="text-white border-white"
                style={{ borderColor: tag.color, color: tag.color }}>

                  {tag.name}
                </Badge>
              )}
            </div>
            
            <h1 className="font-bold text-white mb-4">
              {recipe.name}
            </h1>
            
            <p className="text-lg text-gray-200 mb-4 max-w-3xl">
              {recipe.description || recipe.short_teaser}
            </p>
            
            <div className="flex items-center gap-6 text-white">
              <div className="flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                <span>by {recipe.contributor_name}</span>
                <Badge className={`ml-2 ${
                recipe.contributor_type === 'Chef' ? 'bg-purple-600' :
                recipe.contributor_type === 'Seller' ? 'bg-blue-600' :
                'bg-gray-600'}`
                }>
                  {recipe.contributor_type}
                </Badge>
              </div>
              
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{recipe.rating.toFixed(1)}</span>
                <span className="text-gray-300">({recipe.rating_count})</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Users className="h-5 w-5" />
                <span>{recipe.cooked_count} cooked this</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Info Cards */}
      <div className="container mx-auto px-4 py-8 -mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center p-4">
            <Clock className="h-6 w-6 mx-auto mb-2 text-orange-600" />
            <div className="font-medium">Prep Time</div>
            <div className="text-sm text-gray-600">{recipe.prep_time} min</div>
          </Card>
          
          <Card className="text-center p-4">
            <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <div className="font-medium">Cook Time</div>
            <div className="text-sm text-gray-600">{recipe.cook_time} min</div>
          </Card>
          
          <Card className="text-center p-4">
            <Users className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <div className="font-medium">Servings</div>
            <div className="flex items-center justify-center gap-2 mt-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => adjustServings(currentServings - 1)}
                disabled={currentServings <= 1}>

                -
              </Button>
              <span className="text-sm font-medium min-w-8 text-center">{currentServings}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => adjustServings(currentServings + 1)}
                disabled={currentServings >= 20}>

                +
              </Button>
            </div>
          </Card>
          
          <Card className="text-center p-4">
            <div className="mb-2">
              <Badge className={getDifficultyColor(recipe.difficulty_level)}>
                {recipe.difficulty_level}
              </Badge>
            </div>
            <div className="font-medium">Difficulty</div>
            <div className="text-sm text-gray-600">Level</div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="ingredients" className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-6">
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="method">Method</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="products" className="hidden md:block">Shop</TabsTrigger>
            <TabsTrigger value="video" className="hidden md:block">Video</TabsTrigger>
          </TabsList>

          <TabsContent value="ingredients" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Ingredients</span>
                  <Badge variant="outline">
                    Serves {currentServings}
                    {currentServings !== recipe.servings &&
                    <span className="ml-1 text-xs">
                        (adjusted from {recipe.servings})
                      </span>
                    }
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {formatIngredients(recipe.ingredients).map((ingredient, index) =>
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="flex-1">{ingredient}</span>
                      <Button size="sm" variant="outline">
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="method" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Cooking Method</CardTitle>
              </CardHeader>
              <CardContent>
                {recipeSteps.length > 0 ?
                <div className="space-y-6">
                    {recipeSteps.map((step, index) =>
                  <div key={step.id} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-medium">
                          {step.step_number}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Step {step.step_number}</h4>
                            {step.time_minutes > 0 &&
                        <Badge variant="outline">
                                <Clock className="h-3 w-3 mr-1" />
                                {step.time_minutes} min
                              </Badge>
                        }
                          </div>
                          <p className="text-gray-700 mb-3">{step.instruction}</p>
                          {step.image_url &&
                      <img
                        src={step.image_url}
                        alt={`Step ${step.step_number}`}
                        className="w-full max-w-md h-48 object-cover rounded-lg" />

                      }
                        </div>
                      </div>
                  )}
                  </div> :

                <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{recipe.instructions}</p>
                  </div>
                }
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Chef's Tips & Tricks</CardTitle>
              </CardHeader>
              <CardContent>
                {recipe.tips ?
                <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{recipe.tips}</p>
                  </div> :

                <p className="text-gray-500 italic">No special tips available for this recipe.</p>
                }
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Nutritional Information</CardTitle>
                <p className="text-sm text-gray-600">Per serving</p>
              </CardHeader>
              <CardContent>
                {recipe.nutrition_info ?
                <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{recipe.nutrition_info}</p>
                  </div> :

                <p className="text-gray-500 italic">Nutritional information not available.</p>
                }
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Related Products</CardTitle>
                <p className="text-sm text-gray-600">Get ingredients and spices for this recipe</p>
              </CardHeader>
              <CardContent>
                {relatedProducts.length > 0 ?
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedProducts.slice(0, 4).map((product) =>
                  <ProductCard key={product.id} product={product} />
                  )}
                  </div> :

                <p className="text-gray-500 italic">No related products available.</p>
                }
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="video" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Video Tutorial</CardTitle>
              </CardHeader>
              <CardContent>
                {recipe.video_url ?
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Play className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">Video tutorial available</p>
                      <Button className="mt-4" onClick={() => window.open(recipe.video_url)}>
                        Watch Video
                      </Button>
                    </div>
                  </div> :

                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Play className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500">No video tutorial available for this recipe.</p>
                    </div>
                  </div>
                }
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>);

};

export default RecipeDetailPage;