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
    <footer className="bg-dark-brown text-warm-white mt-16">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-clay-red to-turmeric-yellow rounded-lg flex items-center justify-center">
                <span className="text-white font-playfair font-bold text-xl">BD</span>
              </div>
              <div>
                <h3 className="text-xl font-playfair font-bold">Bihari Delicacies</h3>
                <p className="text-sm text-warm-gray">Authentic Flavors of Bihar</p>
              </div>
            </div>
            <p className="text-sm text-warm-gray leading-relaxed">
              Bringing you the authentic tastes of Bihar through carefully curated products from local artisans and traditional recipes passed down through generations.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-turmeric-yellow" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-turmeric-yellow" />
                <span>hello@biharidelicacies.com</span>
              </div>
              <div className="flex items-start space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-turmeric-yellow mt-0.5" />
                <span>Bihar, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-playfair font-semibold mb-4 text-turmeric-yellow">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) =>
              <li key={link.name}>
                  <Link
                  to={link.path}
                  className="text-sm text-warm-gray hover:text-turmeric-yellow transition-colors duration-200">

                    {link.name}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-lg font-playfair font-semibold mb-4 text-turmeric-yellow">Policies</h4>
            <ul className="space-y-2">
              {policyLinks.map((link) =>
              <li key={link.name}>
                  <Link
                  to={link.path}
                  className="text-sm text-warm-gray hover:text-turmeric-yellow transition-colors duration-200">

                    {link.name}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h4 className="text-lg font-playfair font-semibold mb-4 text-turmeric-yellow">Stay Connected</h4>
            
            {/* Newsletter Signup */}
            <form onSubmit={handleNewsletterSubmit} className="space-y-3 mb-6">
              <p className="text-sm text-warm-gray">
                Subscribe to our newsletter for recipes and special offers.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-indigo-dark border-indigo-light text-white placeholder:text-warm-gray focus:border-turmeric-yellow"
                  required />

                <Button
                  type="submit"
                  disabled={isSubscribing}
                  className="bg-turmeric-yellow hover:bg-turmeric-yellow-dark text-dark-brown font-semibold px-6">

                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </div>
            </form>

            {/* Social Media Links */}
            <div>
              <p className="text-sm text-warm-gray mb-3">Follow us on social media</p>
              <div className="flex space-x-4">
                {socialLinks.map((social) =>
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-warm-gray ${social.color} transition-colors duration-200`}
                  aria-label={`Follow us on ${social.name}`}>

                    <social.icon className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-indigo-dark bg-indigo-dark">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 text-sm text-warm-gray mb-4 md:mb-0">
              <span>© {currentYear} Bihari Delicacies. All rights reserved.</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-sm text-warm-gray">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-clay-red" />
                <span>for authentic Bihari cuisine</span>
              </div>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="mt-4 pt-4 border-t border-indigo text-center">
            <p className="text-xs text-warm-gray">
              Supporting local artisans and preserving traditional Bihari culinary heritage since 2020
            </p>
          </div>
        </div>
      </div>
    </footer>);

};

export default Footer;