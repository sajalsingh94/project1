// Seed data for Bihari Delicacies

export const seedCategories = [
{ name: "Sweets & Desserts", description: "Traditional Bihari sweets and desserts", image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop" },
{ name: "Snacks & Savories", description: "Crispy snacks and savory items", image_url: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300&h=200&fit=crop" },
{ name: "Spices & Masalas", description: "Fresh spices and spice blends", image_url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=200&fit=crop" },
{ name: "Pickles & Chutneys", description: "Traditional pickles and chutneys", image_url: "https://images.unsplash.com/photo-1599228002275-0e96d0f8ca1c?w=300&h=200&fit=crop" },
{ name: "Dal & Pulses", description: "Various lentils and pulses", image_url: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=300&h=200&fit=crop" },
{ name: "Rice & Grains", description: "Premium rice varieties and grains", image_url: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=300&h=200&fit=crop" }];


export const seedDietaryTags = [
{ name: "Vegetarian", color: "#6B8E3D" },
{ name: "Vegan", color: "#4C5B7C" },
{ name: "Gluten-Free", color: "#E4A853" },
{ name: "Sugar-Free", color: "#C44536" },
{ name: "Organic", color: "#6B8E3D" }];


export const seedSpiceLevels = [
{ name: "Mild", level: 1 },
{ name: "Medium", level: 3 },
{ name: "Hot", level: 4 },
{ name: "Extra Hot", level: 5 }];


export const seedDeliveryOptions = [
{ name: "Standard Delivery", description: "Regular delivery within 3-5 days", estimated_days: 4 },
{ name: "Express Delivery", description: "Fast delivery within 1-2 days", estimated_days: 2 },
{ name: "Same Day Delivery", description: "Same day delivery in select cities", estimated_days: 0 }];


export const seedSellers = [
{
  business_name: "Mithaiwala Sweets",
  owner_name: "Ram Prasad Gupta",
  email: "ram@mithaiwala.com",
  phone: "+91 9876543210",
  address: "Gandhi Maidan, Patna",
  city: "Patna",
  state: "Bihar",
  description: "Family business serving authentic Bihari sweets since 1950. Famous for our traditional Khaja and Gur Sandesh.",
  profile_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  banner_image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=300&fit=crop",
  rating: 4.8,
  total_reviews: 156,
  is_verified: true,
  established_year: 1950,
  specialties: "Khaja, Gur Sandesh, Tilkut"
},
{
  business_name: "Bihari Kitchen",
  owner_name: "Sunita Devi",
  email: "sunita@biharikitchen.com",
  phone: "+91 9876543211",
  address: "Station Road, Muzaffarpur",
  city: "Muzaffarpur",
  state: "Bihar",
  description: "Traditional home-made products prepared with authentic recipes passed down through generations.",
  profile_image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
  banner_image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=300&fit=crop",
  rating: 4.6,
  total_reviews: 89,
  is_verified: true,
  established_year: 2010,
  specialties: "Home-style pickles, spice blends"
},
{
  business_name: "Ganga Spices",
  owner_name: "Manoj Kumar Singh",
  email: "manoj@gangaspices.com",
  phone: "+91 9876543212",
  address: "Boring Road, Patna",
  city: "Patna",
  state: "Bihar",
  description: "Premium quality spices and masalas sourced directly from farmers across Bihar.",
  profile_image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  banner_image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=300&fit=crop",
  rating: 4.7,
  total_reviews: 203,
  is_verified: true,
  established_year: 2005,
  specialties: "Turmeric, red chili, garam masala"
}];


export const seedProducts = [
{
  name: "Authentic Silao Khaja",
  description: "Traditional layered sweet from Silao, crispy and delicious with pure ghee",
  price: 350,
  original_price: 400,
  seller_id: 1,
  category_id: 1,
  spice_level_id: 1,
  weight: "500g",
  ingredients: "Refined flour, Pure ghee, Sugar, Cardamom",
  shelf_life: "15 days",
  stock_quantity: 25,
  rating: 4.8,
  review_count: 45,
  is_featured: true,
  is_bestseller: true,
  main_image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop"
},
{
  name: "Gur Sandesh",
  description: "Traditional jaggery-based sweet, soft and melt-in-mouth",
  price: 280,
  original_price: 320,
  seller_id: 1,
  category_id: 1,
  spice_level_id: 1,
  weight: "400g",
  ingredients: "Fresh milk, Jaggery, Cardamom powder",
  shelf_life: "5 days (refrigerated)",
  stock_quantity: 15,
  rating: 4.6,
  review_count: 32,
  is_featured: true,
  is_bestseller: false,
  main_image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=400&fit=crop"
},
{
  name: "Bihari Sattu",
  description: "Roasted gram flour, perfect for summers and highly nutritious",
  price: 120,
  original_price: 150,
  seller_id: 2,
  category_id: 5,
  spice_level_id: 1,
  weight: "1kg",
  ingredients: "Roasted Bengal gram",
  shelf_life: "6 months",
  stock_quantity: 50,
  rating: 4.7,
  review_count: 67,
  is_featured: true,
  is_bestseller: true,
  main_image: "https://images.unsplash.com/photo-1563050650-ac2b0981e244?w=400&h=400&fit=crop"
},
{
  name: "Homemade Mango Pickle",
  description: "Traditional mango pickle with authentic spices and mustard oil",
  price: 180,
  original_price: 200,
  seller_id: 2,
  category_id: 4,
  spice_level_id: 3,
  weight: "300g",
  ingredients: "Raw mango, Mustard oil, Red chili, Turmeric, Fenugreek",
  shelf_life: "1 year",
  stock_quantity: 30,
  rating: 4.5,
  review_count: 28,
  is_featured: false,
  is_bestseller: true,
  main_image: "https://images.unsplash.com/photo-1599228002275-0e96d0f8ca1c?w=400&h=400&fit=crop"
},
{
  name: "Premium Turmeric Powder",
  description: "Farm-fresh turmeric powder with high curcumin content",
  price: 95,
  original_price: 110,
  seller_id: 3,
  category_id: 3,
  spice_level_id: 1,
  weight: "250g",
  ingredients: "Pure turmeric rhizomes",
  shelf_life: "2 years",
  stock_quantity: 100,
  rating: 4.9,
  review_count: 89,
  is_featured: true,
  is_bestseller: true,
  main_image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop"
},
{
  name: "Bihari Garam Masala",
  description: "Traditional spice blend perfect for Bihari cuisine",
  price: 85,
  original_price: 100,
  seller_id: 3,
  category_id: 3,
  spice_level_id: 2,
  weight: "100g",
  ingredients: "Cinnamon, Cardamom, Cloves, Black pepper, Cumin",
  shelf_life: "1 year",
  stock_quantity: 75,
  rating: 4.6,
  review_count: 54,
  is_featured: false,
  is_bestseller: false,
  main_image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=400&fit=crop"
}];


export const seedRecipes = [
{
  name: "Authentic Litti Chokha",
  description: "Traditional Bihari dish with roasted wheat balls served with mashed vegetables",
  prep_time: 45,
  cook_time: 60,
  servings: 4,
  difficulty_level: "Medium",
  spice_level_id: 3,
  category: "Main Course",
  region: "Bihar",
  ingredients: "Wheat flour, Sattu, Onions, Tomatoes, Brinjal, Potatoes, Garlic, Green chilies, Mustard oil",
  instructions: "1. Make dough with wheat flour. 2. Prepare sattu filling with spices. 3. Stuff and shape litti. 4. Cook in clay oven or tandoor. 5. Prepare chokha by roasting vegetables. 6. Serve hot with ghee.",
  tips: "Use mustard oil for authentic flavor. Cook litti in clay oven for best results.",
  is_featured: true,
  main_image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop"
},
{
  name: "Thekua",
  description: "Traditional sweet snack made during Chhath Puja",
  prep_time: 30,
  cook_time: 45,
  servings: 6,
  difficulty_level: "Easy",
  spice_level_id: 1,
  category: "Dessert",
  region: "Bihar",
  ingredients: "Wheat flour, Jaggery, Ghee, Coconut, Fennel seeds",
  instructions: "1. Mix flour with ghee. 2. Prepare jaggery syrup. 3. Knead dough with syrup. 4. Add coconut and fennel. 5. Shape and deep fry. 6. Cool and store.",
  tips: "Maintain medium heat while frying. Store in airtight container.",
  is_featured: true,
  main_image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop"
},
{
  name: "Bihari Fish Curry",
  description: "Spicy fish curry in mustard gravy, a Bengali-Bihari fusion",
  prep_time: 20,
  cook_time: 40,
  servings: 4,
  difficulty_level: "Medium",
  spice_level_id: 4,
  category: "Main Course",
  region: "Bihar",
  ingredients: "Fish, Mustard seeds, Turmeric, Red chili, Onions, Tomatoes, Mustard oil",
  instructions: "1. Marinate fish with turmeric. 2. Fry fish lightly. 3. Prepare mustard paste. 4. Cook gravy with spices. 5. Add fish and simmer. 6. Garnish with cilantro.",
  tips: "Use mustard oil for authentic taste. Don't overcook fish.",
  is_featured: false,
  main_image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop"
}];


export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Seed categories
    for (const category of seedCategories) {
      await window.ezsite.apis.tableCreate(39097, category);
    }

    // Seed dietary tags
    for (const tag of seedDietaryTags) {
      await window.ezsite.apis.tableCreate(39098, tag);
    }

    // Seed spice levels
    for (const level of seedSpiceLevels) {
      await window.ezsite.apis.tableCreate(39099, level);
    }

    // Seed delivery options
    for (const option of seedDeliveryOptions) {
      await window.ezsite.apis.tableCreate(39100, option);
    }

    // Seed sellers
    for (const seller of seedSellers) {
      await window.ezsite.apis.tableCreate(39101, seller);
    }

    // Seed products
    for (const product of seedProducts) {
      await window.ezsite.apis.tableCreate(39102, product);
    }

    // Seed recipes
    for (const recipe of seedRecipes) {
      await window.ezsite.apis.tableCreate(39103, recipe);
    }

    console.log('Database seeding completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error };
  }
}