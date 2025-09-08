import React from 'react';
import { MapPin, Heart, Award, Users, Target, Leaf, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';

export default function AboutPage() {
  const stats = [
  { icon: Users, value: "500+", label: "Happy Customers" },
  { icon: MapPin, value: "12+", label: "Verified Sellers" },
  { icon: Award, value: "50+", label: "Authentic Products" },
  { icon: Clock, value: "3+", label: "Years of Trust" }];


  const values = [
  {
    icon: Heart,
    title: "Authenticity First",
    description: "We ensure every product represents the true taste and tradition of Bihar, sourced directly from local artisans."
  },
  {
    icon: Leaf,
    title: "Quality Assurance",
    description: "Each product undergoes rigorous quality checks to maintain the highest standards of freshness and taste."
  },
  {
    icon: Users,
    title: "Community Support",
    description: "We empower local sellers and artisans by providing them a platform to showcase their traditional crafts."
  },
  {
    icon: Target,
    title: "Customer Satisfaction",
    description: "Our dedicated support team ensures every customer has an exceptional experience with authentic flavors."
  }];


  const team = [
  {
    name: "Sajal Singh",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    bio: "Born in Patna, Sajal is passionate about preserving Bihar's culinary heritage and supporting local artisans."
  }];


  return (
    <div className="min-h-screen bg-warm-white">
      <SEOHead
        title="About Us - Our Mission to Preserve Bihari Culinary Heritage"
        description="Learn about Bihari Delicacies' mission to preserve and share authentic Bihari cuisine through quality products and traditional recipes from local artisans."
        keywords="about Bihari Delicacies, Bihar food heritage, authentic cuisine mission, local artisans support" />


      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo to-indigo-dark text-white py-16 lg:py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2740%27 height=%2740%27 viewBox=%270 0 40 40%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%23E4A853%27 fill-opacity=%270.1%27%3E%3Cpath d=%27M20 20c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8zm0-20c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-playfair font-bold mb-6">
              Preserving Bihar's
              <span className="block text-turmeric-yellow">Culinary Heritage</span>
            </h1>
            <p className="text-xl lg:text-2xl text-indigo-light leading-relaxed mb-8">
              We're on a mission to bring authentic Bihari flavors to your table while supporting local artisans and preserving traditional recipes passed down through generations.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/shops">
                <Button size="lg" className="bg-turmeric-yellow hover:bg-turmeric-yellow-dark text-dark-brown font-semibold px-8">
                  Explore Products
                </Button>
              </Link>
              <Link to="/recipes">
                <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-indigo font-semibold px-8 bg-white text-[#0a0a0a]">
                  Discover Recipes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) =>
            <Card key={index} className="text-center border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <stat.icon className="w-12 h-12 text-clay-red mx-auto mb-4" />
                  <div className="text-3xl font-playfair font-bold text-indigo mb-2">
                    {stat.value}
                  </div>
                  <div className="text-warm-gray font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-playfair font-bold text-indigo mb-6">
                Our Story
              </h2>
              <p className="text-lg text-warm-gray leading-relaxed">
                Born from a deep love for Bihar's rich culinary traditions
              </p>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <p className="text-warm-gray leading-relaxed mb-6">
                  Bihar, the land of ancient kingdoms and rich cultural heritage, has always been home to extraordinary culinary traditions. From the famous <em>Litti Chokha</em> to the delicate <em>Khaja</em> sweets of Silao, every dish tells a story of generations of culinary wisdom.
                </p>
                
                <p className="text-warm-gray leading-relaxed mb-6">
                  Founded in 2020, Bihari Delicacies was born from a simple yet profound realization - that these authentic flavors and traditional recipes were slowly disappearing from modern tables. Our founders, deeply rooted in Bihari culture, embarked on a journey to preserve and share these culinary treasures with the world.
                </p>
                
                <p className="text-warm-gray leading-relaxed mb-6">
                  What started as a mission to support local artisans in Bihar has grown into a thriving marketplace that connects food lovers across India with authentic, high-quality products. We work directly with families who have been perfecting their recipes for generations, ensuring that every product carries the true essence of Bihar.
                </p>
                
                <p className="text-warm-gray leading-relaxed">
                  Today, we're proud to support over a dozen verified sellers across Bihar, from the sweet makers of Muzaffarpur to the spice growers of Nalanda. Every purchase on our platform not only brings authentic flavors to your home but also supports the livelihoods of these dedicated artisans.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-playfair font-bold text-indigo mb-6">
              Our Values
            </h2>
            <p className="text-lg text-warm-gray max-w-2xl mx-auto">
              These core principles guide everything we do, from product selection to customer service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) =>
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-clay-red to-turmeric-yellow rounded-lg flex items-center justify-center">
                        <value.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-playfair font-semibold text-indigo mb-3">
                        {value.title}
                      </h3>
                      <p className="text-warm-gray leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-playfair font-bold text-indigo mb-6">
              Meet Our Team
            </h2>
            <p className="text-lg text-warm-gray max-w-2xl mx-auto">
              Passionate individuals dedicated to preserving and sharing Bihar's culinary heritage
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) =>
            <Card key={index} className="text-center border-none shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
                <CardContent className="p-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-turmeric-yellow/20">
                    <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover" />

                  </div>
                  <h3 className="text-xl font-playfair font-semibold text-indigo mb-1">
                    {member.name}
                  </h3>
                  <p className="text-turmeric-yellow-dark font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-warm-gray leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-clay-red to-clay-red-dark">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-playfair font-bold text-white mb-4">
              Join Our Culinary Journey
            </h2>
            <p className="text-lg text-clay-red-light mb-8">
              Become part of our mission to preserve and celebrate Bihar's rich food heritage
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/shops">
                <Button size="lg" className="bg-white text-clay-red hover:bg-cream font-semibold px-8">
                  Shop Authentic Products
                </Button>
              </Link>
              <Link to="/become-seller">
                <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-clay-red font-semibold px-8 bg-white text-[#0a0a0a]">
                  Become a Partner
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>);

}