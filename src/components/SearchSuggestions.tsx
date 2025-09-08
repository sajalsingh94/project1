import React, { useState, useEffect, useRef } from 'react';
import { Search, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'trending' | 'category';
  category?: string;
}

interface SearchSuggestionsProps {
  query: string;
  isVisible: boolean;
  onSelect: (suggestion: string) => void;
  onClose: () => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  isVisible,
  onSelect,
  onClose
}) => {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches] = useState<string[]>([
    'Khaja',
    'Litti Chokha',
    'Thekua',
    'Gur Sandesh',
    'Tilkut',
    'Chana Ghugni',
    'Sattu Paratha',
    'Malpua'
  ]);
  
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing recent searches:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (!isVisible || !query.trim()) {
      setSuggestions([]);
      return;
    }

    const generateSuggestions = (): SearchSuggestion[] => {
      const allSuggestions: SearchSuggestion[] = [];
      const queryLower = query.toLowerCase();

      // Add recent searches that match
      recentSearches
        .filter(search => search.toLowerCase().includes(queryLower))
        .slice(0, 3)
        .forEach(search => {
          allSuggestions.push({
            id: `recent-${search}`,
            text: search,
            type: 'recent'
          });
        });

      // Add trending searches that match
      trendingSearches
        .filter(search => search.toLowerCase().includes(queryLower))
        .slice(0, 3)
        .forEach(search => {
          allSuggestions.push({
            id: `trending-${search}`,
            text: search,
            type: 'trending'
          });
        });

      // Add category suggestions
      const categories = [
        'Sweets & Desserts',
        'Spicy Snacks',
        'Traditional Breads',
        'Beverages',
        'Pickles & Chutneys'
      ];

      categories
        .filter(category => category.toLowerCase().includes(queryLower))
        .slice(0, 2)
        .forEach(category => {
          allSuggestions.push({
            id: `category-${category}`,
            text: category,
            type: 'category',
            category
          });
        });

      return allSuggestions.slice(0, 8); // Limit to 8 suggestions
    };

    setSuggestions(generateSuggestions());
  }, [query, isVisible, recentSearches, trendingSearches]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible, onClose]);

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    // Save to recent searches
    const newRecent = [suggestion.text, ...recentSearches.filter(s => s !== suggestion.text)].slice(0, 10);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));

    // Navigate to search results
    onSelect(suggestion.text);
    navigate(`/shops?search=${encodeURIComponent(suggestion.text)}`);
    onClose();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
    >
      {suggestions.length > 0 ? (
        <div className="py-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-150"
            >
              {suggestion.type === 'recent' && <Clock className="w-4 h-4 text-gray-400" />}
              {suggestion.type === 'trending' && <TrendingUp className="w-4 h-4 text-orange-500" />}
              {suggestion.type === 'category' && <Search className="w-4 h-4 text-blue-500" />}
              
              <div className="flex-1">
                <div className="text-gray-900">{suggestion.text}</div>
                {suggestion.type === 'recent' && (
                  <div className="text-xs text-gray-500">Recent search</div>
                )}
                {suggestion.type === 'trending' && (
                  <div className="text-xs text-orange-600">Trending</div>
                )}
                {suggestion.type === 'category' && (
                  <div className="text-xs text-blue-600">Category</div>
                )}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="px-4 py-3 text-gray-500 text-sm">
          No suggestions found
        </div>
      )}

      {recentSearches.length > 0 && (
        <div className="border-t border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Recent searches</span>
            <button
              onClick={clearRecentSearches}
              className="text-xs text-orange-600 hover:text-orange-700"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;