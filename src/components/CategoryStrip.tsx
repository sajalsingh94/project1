import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface Category {
  id: number;
  name: string;
  description: string;
  image_url: string;
}

interface CategoryStripProps {
  categories: Category[];
  selectedCategory?: number;
  onCategorySelect: (categoryId: number | undefined) => void;
}

const CategoryStrip: React.FC<CategoryStripProps> = ({
  categories,
  selectedCategory,
  onCategorySelect
}) => {
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <ScrollArea>
          <div className="flex space-x-2 pb-2">
            <Badge
              variant={selectedCategory === undefined ? "default" : "outline"}
              className={`cursor-pointer whitespace-nowrap ${
              selectedCategory === undefined ?
              'bg-orange-600 hover:bg-orange-700' :
              'hover:bg-gray-100'}`
              }
              onClick={() => onCategorySelect(undefined)}>

              All Categories
            </Badge>
            {categories.map((category) =>
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`cursor-pointer whitespace-nowrap ${
              selectedCategory === category.id ?
              'bg-orange-600 hover:bg-orange-700' :
              'hover:bg-gray-100'}`
              }
              onClick={() => onCategorySelect(category.id)}>

                {category.name}
              </Badge>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>);

};

export default CategoryStrip;