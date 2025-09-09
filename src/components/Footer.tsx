import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);

    // Simulate newsletter subscription
    setTimeout(() => {
      toast({
        title: "Subscribed Successfully!",
        description: "Thank you for subscribing to our newsletter. You'll receive updates about new products and recipes."
      });
      setEmail('');
      setIsSubscribing(false);
    }, 1000);
  };

  const currentYear = new Date().getFullYear();

  const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'Shops', path: '/shops' },
  { name: 'Recipes', path: '/recipes' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'FAQs', path: '/faqs' }];


  const policyLinks = [
  { name: 'Privacy Policy', path: '/privacy' },
  { name: 'Terms of Service', path: '/terms' },
  { name: 'Return Policy', path: '/returns' },
  { name: 'Shipping Info', path: '/shipping' },
  { name: 'Cookie Policy', path: '/cookies' },
  { name: 'Seller Agreement', path: '/seller-terms' }];


  const socialLinks = [
  { name: 'Facebook', icon: Facebook, url: 'https://facebook.com/bihariesdelicacies', color: 'hover:text-blue-600' },
  { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/bihariesdelicacies', color: 'hover:text-blue-400' },
  { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/bihariesdelicacies', color: 'hover:text-pink-600' },
  { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/bihariesdelicacies', color: 'hover:text-red-600' }];


  return (
    <footer className="relative bg-gradient-to-br from-dark-brown via-indigo-900 to-indigo-800 text-warm-white mt-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      </div>
      
      {/* Main Footer Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Enhanced Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-clay-red to-turmeric-yellow rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-white font-bold text-2xl">B</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-clay-red/20 to-turmeric-yellow/20 rounded-2xl blur-sm"></div>
              </div>
              <div>
                <h3 className="text-2xl font-playfair font-bold bg-gradient-to-r from-turmeric-yellow to-turmeric-yellow-light bg-clip-text text-transparent">
                  Bihari Delicacies
                </h3>
                <p className="text-sm text-turmeric-yellow-200 font-medium">Authentic Flavors of Bihar</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Bringing you the authentic tastes of Bihar through carefully curated products from local artisans and traditional recipes passed down through generations.
            </p>
            
            {/* Enhanced Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm group cursor-pointer">
                <div className="p-2 bg-turmeric-yellow/20 rounded-lg group-hover:bg-turmeric-yellow/30 transition-colors duration-300">
                  <Phone className="w-4 h-4 text-turmeric-yellow" />
                </div>
                <span className="group-hover:text-turmeric-yellow transition-colors duration-300">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3 text-sm group cursor-pointer">
                <div className="p-2 bg-turmeric-yellow/20 rounded-lg group-hover:bg-turmeric-yellow/30 transition-colors duration-300">
                  <Mail className="w-4 h-4 text-turmeric-yellow" />
                </div>
                <span className="group-hover:text-turmeric-yellow transition-colors duration-300">hello@biharidelicacies.com</span>
              </div>
              <div className="flex items-start space-x-3 text-sm group cursor-pointer">
                <div className="p-2 bg-turmeric-yellow/20 rounded-lg group-hover:bg-turmeric-yellow/30 transition-colors duration-300 mt-0.5">
                  <MapPin className="w-4 h-4 text-turmeric-yellow" />
                </div>
                <span className="group-hover:text-turmeric-yellow transition-colors duration-300">Bihar, India</span>
              </div>
            </div>
          </div>

          {/* Enhanced Quick Links */}
          <div>
            <h4 className="text-xl font-playfair font-bold mb-6 text-turmeric-yellow">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) =>
              <li key={link.name}>
                  <Link
                  to={link.path}
                  className="text-sm text-gray-300 hover:text-turmeric-yellow transition-all duration-300 hover:translate-x-2 flex items-center group">

                    <span className="w-2 h-2 bg-turmeric-yellow rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Enhanced Policies */}
          <div>
            <h4 className="text-xl font-playfair font-bold mb-6 text-turmeric-yellow">Policies</h4>
            <ul className="space-y-3">
              {policyLinks.map((link, index) =>
              <li key={link.name}>
                  <Link
                  to={link.path}
                  className="text-sm text-gray-300 hover:text-turmeric-yellow transition-all duration-300 hover:translate-x-2 flex items-center group">

                    <span className="w-2 h-2 bg-turmeric-yellow rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Enhanced Newsletter & Social */}
          <div>
            <h4 className="text-xl font-playfair font-bold mb-6 text-turmeric-yellow">Stay Connected</h4>
            
            {/* Enhanced Newsletter Signup */}
            <form onSubmit={handleNewsletterSubmit} className="space-y-4 mb-8">
              <p className="text-sm text-gray-300">
                Subscribe to our newsletter for recipes and special offers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-turmeric-yellow focus:ring-2 focus:ring-turmeric-yellow/20 rounded-2xl px-4 py-3"
                  required />

                <Button
                  type="submit"
                  disabled={isSubscribing}
                  className="bg-gradient-to-r from-turmeric-yellow to-turmeric-yellow-dark hover:from-turmeric-yellow-dark hover:to-turmeric-yellow text-dark-brown font-bold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">

                  {isSubscribing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-dark-brown border-t-transparent rounded-full animate-spin"></div>
                      <span>Subscribing...</span>
                    </div>
                  ) : (
                    'Subscribe'
                  )}
                </Button>
              </div>
            </form>

            {/* Enhanced Social Media Links */}
            <div>
              <p className="text-sm text-gray-300 mb-4 font-medium">Follow us on social media</p>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) =>
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 bg-gray-800/50 rounded-2xl text-gray-300 ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg group`}
                  aria-label={`Follow us on ${social.name}`}>

                  <social.icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer Bottom */}
      <div className="border-t border-gray-700/50 bg-gradient-to-r from-indigo-900 to-indigo-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <span>© {currentYear} Bihari Delicacies. All rights reserved.</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-clay-red animate-pulse" />
                <span>for authentic Bihari cuisine</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-700/50 text-center">
            <p className="text-sm text-gray-400 font-medium">
              Supporting local artisans and preserving traditional Bihari culinary heritage since 2020
            </p>
            <div className="mt-3 flex justify-center space-x-6 text-xs text-gray-500">
              <span>🍽️ Traditional Recipes</span>
              <span>🏠 Home Delivery</span>
              <span>🌟 Premium Quality</span>
            </div>
          </div>
        </div>
      </div>
    </footer>);

};

export default Footer;