import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Bihari Delicacies - Authentic Flavors of Bihar",
  description = "Discover authentic Bihari cuisine with our curated collection of traditional products from local artisans and time-tested recipes passed down through generations.",
  keywords = "Bihari food, authentic cuisine, traditional recipes, Bihar marketplace, Indian food, regional delicacies",
  image = "/og-image.jpg",
  url = window.location.href,
  type = "website"
}) => {
  const fullTitle = title.includes('Bihari Delicacies') ? title : `${title} - Bihari Delicacies`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Bihari Delicacies" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Bihari Delicacies" />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#C44536" />
      <meta name="msapplication-TileColor" content="#C44536" />
      <link rel="canonical" href={url} />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Bihari Delicacies",
          "description": description,
          "url": "https://biharidelicacies.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://biharidelicacies.com/logo.png"
          },
          "sameAs": [
          "https://facebook.com/biharidelicacies",
          "https://twitter.com/biharidelicacies",
          "https://instagram.com/biharidelicacies"],

          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://biharidelicacies.com/shops?search={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
    </Helmet>);

};

export default SEOHead;