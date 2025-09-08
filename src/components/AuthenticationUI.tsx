import React, { useState, useEffect } from 'react';
import { User, LogIn, ShoppingCart, Heart, Package, LogOut, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger } from
'@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface AuthenticationUIProps {
  className?: string;
}

const AuthenticationUI: React.FC<AuthenticationUIProps> = ({ className = "" }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data, error } = await window.ezsite.apis.getUserInfo();
      if (!error && data) {
        setIsLoggedIn(true);
        setUser(data);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await window.ezsite.apis.logout();
      if (!error) {
        setIsLoggedIn(false);
        setUser(null);
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full"></div>;
  }

  if (!isLoggedIn) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Link to="/login">
          <Button variant="ghost" size="sm" className="text-gray-700 hover:text-orange-600">
            <LogIn className="w-4 h-4 mr-1" />
            Login
          </Button>
        </Link>
        <Link to="/register">
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
            <UserPlus className="w-4 h-4 mr-1" />
            Sign Up
          </Button>
        </Link>
      </div>);

  }

  const getInitials = (name: string) => {
    return name.
    split(' ').
    map((word) => word.charAt(0)).
    join('').
    toUpperCase().
    slice(0, 2);
  };

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt={user?.Name || ''} />
              <AvatarFallback className="bg-orange-100 text-orange-700">
                {user?.Name ? getInitials(user.Name) : 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {user?.Name &&
              <p className="font-medium">{user.Name}</p>
              }
              {user?.Email &&
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {user.Email}
                </p>
              }
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/orders" className="flex items-center">
              <Package className="mr-2 h-4 w-4" />
              My Orders
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/wishlist" className="flex items-center">
              <Heart className="mr-2 h-4 w-4" />
              Wishlist
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/become-seller" className="flex items-center">
              <Package className="mr-2 h-4 w-4" />
              Become a Seller
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="flex items-center text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>);

};

export default AuthenticationUI;