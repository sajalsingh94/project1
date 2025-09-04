import React from 'react';
import { Clock, ChefHat, Star, Users, Heart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface DietaryTag {
  id: number;
  name: string;
  color: string;
}

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
}

interface RecipeCardProps {
  recipe: Recipe;
  dietaryTags?: DietaryTag[];
  onFavoriteToggle?: (recipeId: number) => void;
  isFavorite?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  dietaryTags = [],
  onFavoriteToggle,
  isFavorite = false
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/recipes/${recipe.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteToggle?.(recipe.id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':return 'bg-green-100 text-green-800';
      case 'medium':return 'bg-yellow-100 text-yellow-800';
      case 'hard':return 'bg-red-100 text-red-800';
      default:return 'bg-gray-100 text-gray-800';
    }
  };

  const getContributorColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'chef':return 'bg-purple-100 text-purple-800';
      case 'seller':return 'bg-blue-100 text-blue-800';
      default:return 'bg-gray-100 text-gray-800';
    }
  };

  const totalTime = recipe.prep_time + recipe.cook_time;

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 relative overflow-hidden"
      onClick={handleCardClick}>

      <div className="relative">
        <div className="aspect-video overflow-hidden">
          <img
            src={recipe.main_image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=60'}
            alt={recipe.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />

        </div>
        
        {/* Favorite Button */}
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full"
          onClick={handleFavoriteClick}>

          <Heart
            className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />

        </Button>

        {/* Category Badge */}
        <Badge className="absolute top-2 left-2 bg-white/90 text-gray-800 hover:bg-white">
          {recipe.category}
        </Badge>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-orange-600 transition-colors">
              {recipe.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {recipe.short_teaser}
            </p>
          </div>

          {/* Contributor */}
          <div className="flex items-center gap-2">
            <ChefHat className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">by</span>
            <Badge variant="secondary" className={getContributorColor(recipe.contributor_type)}>
              {recipe.contributor_name}
            </Badge>
          </div>

          {/* Time and Difficulty */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{totalTime}min</span>
              </div>
              <div className="text-xs text-gray-500">
                Prep: {recipe.prep_time}min | Cook: {recipe.cook_time}min
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Badge className={getDifficultyColor(recipe.difficulty_level)}>
              {recipe.difficulty_level}
            </Badge>
            
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{recipe.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-500">({recipe.rating_count})</span>
            </div>
          </div>

          {/* Dietary Tags */}
          {dietaryTags.length > 0 &&
          <div className="flex flex-wrap gap-1">
              {dietaryTags.slice(0, 3).map((tag) =>
            <Badge
              key={tag.id}
              variant="outline"
              className="text-xs"
              style={{ borderColor: tag.color, color: tag.color }}>

                  {tag.name}
                </Badge>
            )}
              {dietaryTags.length > 3 &&
            <Badge variant="outline" className="text-xs">
                  +{dietaryTags.length - 3}
                </Badge>
            }
            </div>
          }
        </div>
      </CardContent>

      <CardFooter className="pt-0 px-4 pb-4">
        <div className="flex items-center justify-between w-full text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{recipe.cooked_count} cooked this</span>
          </div>
          <span className="capitalize">{recipe.difficulty_level}</span>
        </div>
      </CardFooter>
    </Card>);

};

export default RecipeCard;