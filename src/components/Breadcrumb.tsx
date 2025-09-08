import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', path: '/' }
    ];

    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Convert segment to readable label
      let label = segment;
      
      // Handle specific routes
      switch (segment) {
        case 'shops':
          label = 'Shops';
          break;
        case 'recipes':
          label = 'Recipes';
          break;
        case 'about':
          label = 'About';
          break;
        case 'login':
          label = 'Login';
          break;
        case 'register':
          label = 'Register';
          break;
        case 'become-seller':
          label = 'Become a Seller';
          break;
        case 'seller':
          if (pathSegments[index + 1] === 'dashboard') {
            label = 'Seller Dashboard';
          } else {
            label = 'Seller';
          }
          break;
        case 'dashboard':
          label = 'Dashboard';
          break;
        case 'checkout':
          label = 'Checkout';
          break;
        default:
          // Handle dynamic routes like seller/:id
          if (pathSegments[index - 1] === 'seller' && !isNaN(Number(segment))) {
            label = 'Seller Details';
          } else {
            // Capitalize first letter and replace hyphens with spaces
            label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
          }
      }
      
      // Don't add path for the last segment (current page)
      const isLast = index === pathSegments.length - 1;
      breadcrumbs.push({
        label,
        path: isLast ? undefined : currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumb on homepage
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="bg-gray-50 border-b border-gray-200" aria-label="Breadcrumb">
      <div className="container mx-auto px-4 py-3">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
              )}
              
              {index === 0 && (
                <Home className="w-4 h-4 text-gray-500 mr-1" />
              )}
              
              {item.path ? (
                <Link
                  to={item.path}
                  className="text-gray-600 hover:text-orange-600 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;