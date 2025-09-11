import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from '@/lib/safe-motion';
import { api } from '@/lib/api';
import { 
  Search, 
  Menu, 
  X, 
  User, 
  ShoppingCart, 
  Heart, 
  Store,
  BookOpen,
  Info
} from 'lucide-react';
import AnimatedButton from './ui/AnimatedButton';
import ThemeToggle from './ThemeToggle';

interface UserInfo {
  ID: number;
  Name: string;
  Email: string;
  Roles: string;
}

const ModernHeader: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigationItems = [
    { name: 'Shops', path: '/shops', icon: Store },
    { name: 'Recipes', path: '/recipes', icon: BookOpen },
    { name: 'About', path: '/about', icon: Info },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    checkUserAuth();
    loadCartCount();
  }, []);

  const checkUserAuth = async () => {
    try {
      const getUserInfo = window.ezsite?.apis?.getUserInfo;
      const { data, error } = getUserInfo
        ? await getUserInfo()
        : await api.auth.me();
      if (!error && data) {
        setUser(data as any);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCartCount = () => {
    try {
      const raw = localStorage.getItem('cartItems');
      const cart = raw ? JSON.parse(raw) : [];
      setCartCount(Array.isArray(cart) ? cart.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) : 0);
    } catch {
      setCartCount(0);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shops?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleLogout = async () => {
    try {
      const logout = window.ezsite?.apis?.logout;
      const { error } = logout ? await logout() : await api.auth.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      if (!error) {
        setUser(null);
        window.location.href = '/';
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-700/60 shadow-2xl' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo */}
          <Link to="/" className="flex items-center space-x-3 group min-w-0">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-clay-red via-clay-red-dark to-turmeric-yellow rounded-3xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500">
                <motion.span 
                  className="text-white font-bold text-xl sm:text-2xl"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  B
                </motion.span>
              </div>
              <motion.div
                className="absolute inset-0 rounded-3xl bg-gradient-to-br from-turmeric-yellow/30 to-leaf-green/30"
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-clay-red/20 to-turmeric-yellow/20 blur-sm"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <motion.div 
              className="hidden sm:block truncate"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-clay-red via-clay-red-dark to-turmeric-yellow bg-clip-text text-transparent group-hover:from-turmeric-yellow group-hover:to-leaf-green transition-all duration-500">
                Bihari Delicacies
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Authentic Flavors</p>
            </motion.div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <Link
                    to={item.path}
                    className="relative group"
                  >
                    <motion.div
                      className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all duration-300 font-semibold ${
                        isActive
                          ? 'text-white bg-gradient-to-r from-clay-red to-clay-red-dark shadow-lg'
                          : 'text-gray-700 dark:text-gray-300 hover:text-clay-red dark:hover:text-clay-red-light'
                      }`}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <item.icon className="w-5 h-5" />
                      </motion.div>
                      <span className="font-medium">{item.name}</span>
                    </motion.div>
                    
                    {false && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-clay-red to-clay-red-dark rounded-2xl shadow-lg"
                        layoutId="activeTab"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30
                        }}
                      />
                    )}
                    
                    {/* Hover effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-turmeric-yellow/20 to-leaf-green/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                  </Link>
                </motion.div>
              );
            })}
            {(user?.Roles === 'seller' || localStorage.getItem('role') === 'seller') && (
              <motion.div
                key="seller-dashboard"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Link to="/seller/dashboard" className="relative group">
                  <motion.div
                    className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all duration-300 font-semibold ${
                      location.pathname.startsWith('/seller')
                        ? 'text-white bg-gradient-to-r from-clay-red to-clay-red-dark shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:text-clay-red dark:hover:text-clay-red-light'
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Store className="w-5 h-5" />
                    <span className="font-medium">Seller Dashboard</span>
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-turmeric-yellow/20 to-leaf-green/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                </Link>
              </motion.div>
            )}
          </nav>

          {/* Enhanced Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <motion.div
                className="relative group"
                whileFocus={{ scale: 1.02 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <input
                  type="text"
                  placeholder="Search authentic Bihari products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-2 border-gray-200 dark:border-gray-700 rounded-3xl shadow-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-clay-red/50 focus:border-clay-red transition-all duration-300 text-gray-700 dark:text-gray-300 placeholder-gray-500"
                />
                <motion.div
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Search className="w-6 h-6 text-gray-400 group-focus-within:text-clay-red transition-colors duration-300" />
                </motion.div>
                
                {/* Search suggestions indicator */}
                {searchQuery && (
                  <motion.div
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-2 h-2 bg-clay-red rounded-full animate-pulse"></div>
                  </motion.div>
                )}
              </motion.div>
            </form>
          </div>

          {/* Enhanced User Actions */}
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="hidden md:block mr-2">
              <ThemeToggle />
            </div>
            {/* Cart and Favorites */}
            {user && (
              <>
                <motion.button
                  className="relative p-3 text-gray-700 dark:text-gray-300 hover:text-clay-red transition-all duration-300 rounded-2xl hover:bg-clay-red-50 dark:hover:bg-clay-red-900/20 group"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className="w-6 h-6 group-hover:fill-clay-red transition-all duration-300" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-clay-red/10 to-turmeric-yellow/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                </motion.button>
                
                <motion.button
                  onClick={() => (window.location.href = '/checkout')}
                  className="relative p-3 text-gray-700 dark:text-gray-300 hover:text-clay-red transition-all duration-300 rounded-2xl hover:bg-clay-red-50 dark:hover:bg-clay-red-900/20 group"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  {cartCount > 0 && (
                    <motion.span
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-clay-red to-clay-red-dark text-white text-xs font-bold rounded-full min-w-[24px] h-6 px-2 flex items-center justify-center shadow-lg"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      whileHover={{ scale: 1.2 }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-turmeric-yellow/10 to-leaf-green/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                </motion.button>
              </>
            )}

            {/* Enhanced Authentication */}
            {!isLoading && (
              <motion.div 
                className="hidden md:flex"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {user ? (
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-2xl"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <User className="w-5 h-5 text-clay-red" />
                      </motion.div>
                      <span className="font-semibold">{user.Name}</span>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <AnimatedButton
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                        className="border-clay-red text-clay-red hover:bg-clay-red hover:text-white font-semibold px-6 py-2 rounded-2xl"
                      >
                        Logout
                      </AnimatedButton>
                    </motion.div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <AnimatedButton
                        variant="outline"
                        size="sm"
                        onClick={() => (window.location.href = '/login')}
                        className="border-clay-red text-clay-red hover:bg-clay-red hover:text-white font-semibold px-6 py-2 rounded-2xl"
                      >
                        Login
                      </AnimatedButton>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <AnimatedButton
                        variant="primary"
                        size="sm"
                        onClick={() => (window.location.href = '/register')}
                        className="bg-gradient-to-r from-clay-red to-clay-red-dark hover:from-clay-red-dark hover:to-clay-red text-white font-semibold px-6 py-2 rounded-2xl shadow-lg hover:shadow-xl"
                      >
                        Sign Up
                      </AnimatedButton>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Enhanced Mobile Menu Toggle */}
            <motion.button
              className="md:hidden p-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-clay-red-50 dark:hover:bg-clay-red-900/20 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 500 }}
                  >
                    <X className="w-6 h-6 text-clay-red" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 180, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -180, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 500 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>

        {/* Enhanced Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden mt-6 p-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl"
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Enhanced Mobile Search */}
              <motion.form 
                onSubmit={handleSearch} 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search authentic Bihari products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-clay-red/50 focus:border-clay-red transition-all duration-300 text-gray-700 dark:text-gray-300 placeholder-gray-500"
                  />
                  <motion.div
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Search className="w-5 h-5 text-gray-400 group-focus-within:text-clay-red transition-colors duration-300" />
                  </motion.div>
                </div>
              </motion.form>

              {/* Enhanced Mobile Navigation */}
              <motion.nav 
                className="space-y-3 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                {navigationItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 font-semibold group ${
                          isActive
                            ? 'bg-gradient-to-r from-clay-red to-clay-red-dark text-white shadow-lg'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-clay-red-50 dark:hover:bg-clay-red-900/20 hover:text-clay-red'
                        }`}
                      >
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <item.icon className="w-6 h-6" />
                        </motion.div>
                        <span className="font-medium">{item.name}</span>
                        {isActive && (
                          <motion.div
                            className="ml-auto w-2 h-2 bg-white rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
                {(user?.Roles === 'seller' || localStorage.getItem('role') === 'seller') && (
                  <motion.div
                    key="seller-dashboard-mobile"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <Link
                      to="/seller/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 font-semibold group ${
                        location.pathname.startsWith('/seller')
                          ? 'bg-gradient-to-r from-clay-red to-clay-red-dark text-white shadow-lg'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-clay-red-50 dark:hover:bg-clay-red-900/20 hover:text-clay-red'
                      }`}
                    >
                      <Store className="w-6 h-6" />
                      <span className="font-medium">Seller Dashboard</span>
                    </Link>
                  </motion.div>
                )}
              </motion.nav>

              {/* Enhanced Mobile User Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                {user ? (
                  <div className="space-y-4 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                    <motion.div 
                      className="flex items-center space-x-4 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-2xl"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <User className="w-6 h-6 text-clay-red" />
                      </motion.div>
                      <span className="font-semibold text-lg">{user.Name}</span>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <AnimatedButton
                        variant="outline"
                        size="lg"
                        onClick={handleLogout}
                        className="w-full border-clay-red text-clay-red hover:bg-clay-red hover:text-white font-semibold py-3 rounded-2xl"
                      >
                        Logout
                      </AnimatedButton>
                    </motion.div>
                  </div>
                ) : (
                  <div className="space-y-4 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <AnimatedButton
                        variant="outline"
                        size="lg"
                        onClick={() => {
                          setIsMenuOpen(false);
                          window.location.href = '/login';
                        }}
                        className="w-full border-clay-red text-clay-red hover:bg-clay-red hover:text-white font-semibold py-3 rounded-2xl"
                      >
                        Login
                      </AnimatedButton>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <AnimatedButton
                        variant="primary"
                        size="lg"
                        onClick={() => {
                          setIsMenuOpen(false);
                          window.location.href = '/register';
                        }}
                        className="w-full bg-gradient-to-r from-clay-red to-clay-red-dark hover:from-clay-red-dark hover:to-clay-red text-white font-semibold py-3 rounded-2xl shadow-lg"
                      >
                        Sign Up
                      </AnimatedButton>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default ModernHeader;