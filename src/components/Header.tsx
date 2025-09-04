import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, User, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AuthenticationUI from './AuthenticationUI';

interface UserInfo {
  ID: number;
  Name: string;
  Email: string;
  Roles: string;
}

const Header: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    try {
      const { data, error } = await window.ezsite.apis.getUserInfo();
      if (!error && data) {
        setUser(data);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await window.ezsite.apis.logout();
      if (!error) {
        setUser(null);
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to shops page with search query
      window.location.href = `/shops?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const navigationLinks = [
  { name: 'Home', path: '/', active: location.pathname === '/' },
  { name: 'Shops', path: '/shops', active: location.pathname === '/shops' },
  { name: 'Recipes', path: '/recipes', active: location.pathname === '/recipes' },
  { name: 'About', path: '/about', active: location.pathname === '/about' }];


  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-cream">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-clay-red to-turmeric-yellow rounded-lg flex items-center justify-center">
              <span className="text-white font-playfair font-bold text-xl">BD</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-playfair font-bold gradient-text">
                Bihari Delicacies
              </h1>
              <p className="text-xs text-warm-gray">Authentic Flavors of Bihar</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) =>
            <Link
              key={link.name}
              to={link.path}
              className={`font-inter font-medium transition-colors duration-200 hover:text-clay-red ${
              link.active ? 'text-clay-red border-b-2 border-clay-red pb-1' : 'text-indigo'}`
              }>

                {link.name}
              </Link>
            )}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder="Search for authentic Bihari products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-indigo-light focus:border-clay-red" />

              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-warm-gray" />
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => {/* Toggle mobile search */}}>

              <Search className="w-5 h-5 text-indigo" />
            </Button>

            {/* Cart and Favorites - Show only for logged in users */}
            {user &&
            <>
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <Heart className="w-5 h-5 text-indigo" />
                </Button>
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="w-5 h-5 text-indigo" />
                  <span className="absolute -top-2 -right-2 bg-clay-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </Button>
              </>
            }

            {/* Authentication UI */}
            {!isLoading &&
            <AuthenticationUI className="hidden md:flex" user={user} onLogout={handleLogout} />
            }

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}>

              {isMenuOpen ?
              <X className="w-6 h-6 text-indigo" /> :

              <Menu className="w-6 h-6 text-indigo" />
              }
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen &&
        <div className="md:hidden mt-4 pb-4 border-t border-cream">
            {/* Mobile Search */}
            <div className="lg:hidden mt-4 mb-4">
              <form onSubmit={handleSearch} className="relative">
                <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-indigo-light focus:border-clay-red" />

                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-warm-gray" />
              </form>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-3 mb-4">
              {navigationLinks.map((link) =>
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={`font-inter font-medium py-2 transition-colors duration-200 hover:text-clay-red ${
              link.active ? 'text-clay-red' : 'text-indigo'}`
              }>

                  {link.name}
                </Link>
            )}
            </nav>

            {/* Mobile User Actions */}
            {user &&
          <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-cream">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Favorites</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart</span>
                </Button>
              </div>
          }

            {/* Mobile Auth Buttons */}
            {!isLoading &&
          <div className="flex flex-col space-y-3">
                {user ?
            <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-2 text-indigo">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{user.Name}</span>
                    </div>
                    <Button
                variant="outline"
                onClick={handleLogout}
                className="border-clay-red text-clay-red hover:bg-clay-red hover:text-white">

                      Logout
                    </Button>
                  </div> :

            <>
                    <Link to="/login">
                      <Button
                  variant="outline"
                  className="w-full border-indigo text-indigo hover:bg-indigo hover:text-white"
                  onClick={() => setIsMenuOpen(false)}>

                        Login
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button
                  className="w-full bg-clay-red hover:bg-clay-red-dark text-white"
                  onClick={() => setIsMenuOpen(false)}>

                        Sign Up
                      </Button>
                    </Link>
                    <Link to="/become-seller">
                      <Button
                  className="w-full bg-turmeric-yellow hover:bg-turmeric-yellow-dark text-dark-brown font-semibold"
                  onClick={() => setIsMenuOpen(false)}>

                        Become a Seller
                      </Button>
                    </Link>
                  </>
            }
              </div>
          }
          </div>
        }
      </div>
    </header>);

};

export default Header;