import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchSuggestion {
  id: number;
  name: string;
  type: 'product' | 'seller';
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search for products, shops, or recipes..."
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Search products
      const { data: productsData } = await window.ezsite.apis.tablePage(39102, {
        PageNo: 1,
        PageSize: 5,
        Filters: [
        { name: "name", op: "StringContains", value: searchQuery }]

      });

      // Search sellers
      const { data: sellersData } = await window.ezsite.apis.tablePage(39101, {
        PageNo: 1,
        PageSize: 3,
        Filters: [
        { name: "business_name", op: "StringContains", value: searchQuery }]

      });

      const productSuggestions: SearchSuggestion[] = (productsData?.List || []).map((product: any) => ({
        id: product.id,
        name: product.name,
        type: 'product' as const
      }));

      const sellerSuggestions: SearchSuggestion[] = (sellersData?.List || []).map((seller: any) => ({
        id: seller.id,
        name: seller.business_name,
        type: 'seller' as const
      }));

      setSuggestions([...productSuggestions, ...sellerSuggestions]);
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleSearch = () => {
    onSearch(query);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.name);
    onSearch(suggestion.name);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    setSuggestions([]);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="pl-10 pr-20 py-3 text-lg border-2 focus:border-orange-500 rounded-full" />

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {query &&
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-8 w-8 p-0 hover:bg-gray-100">

              <X className="w-4 h-4" />
            </Button>
          }
          <Button
            type="button"
            onClick={handleSearch}
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full">

            Search
          </Button>
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && query.length > 0 &&
      <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isLoading &&
        <div className="px-4 py-3 text-gray-500">
              Searching...
            </div>
        }
          
          {!isLoading && suggestions.length === 0 && query.length >= 2 &&
        <div className="px-4 py-3 text-gray-500">
              No results found
            </div>
        }
          
          {!isLoading && suggestions.map((suggestion) =>
        <div
          key={`${suggestion.type}-${suggestion.id}`}
          className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
          onClick={() => handleSuggestionClick(suggestion)}>

              <Search className="w-4 h-4 text-gray-400 mr-3" />
              <div className="flex-1">
                <span className="text-gray-900">{suggestion.name}</span>
                <span className="ml-2 text-xs text-gray-500 capitalize">
                  {suggestion.type}
                </span>
              </div>
            </div>
        )}
        </div>
      }
    </div>);

};

export default SearchBar;