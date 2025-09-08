import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import Database from 'better-sqlite3';
import mongoose from 'mongoose';

const __dirnameCurrent = path.dirname(new URL(import.meta.url).pathname);
const app = express();
const PORT = process.env.PORT || 3001;

// CORS for Vite dev server
app.use(cors({ origin: [/^http:\/\/localhost:\d+$/, /^http:\/\/\[::\]:\d+$/], credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Simple in-memory session store
const sessionIdToUserId = new Map();

// Data directory utilities
const dataDir = path.join(__dirnameCurrent, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// MongoDB Configuration
let mongoConnected = false;
let UserModel = null;
let SellerModel = null;
let ProductModel = null;

async function connectMongoIfConfigured() {
  // Use the provided MongoDB connection string
  const uri = process.env.MONGODB_URI || 'mongodb+srv://sajalsingh94_db_user:asdwer@cluster1.vzdx6lp.mongodb.net/?retryWrites=true&w=majority&appName=cluster1';
  if (!uri) return;
  
  try {
    await mongoose.connect(uri, { 
      dbName: process.env.MONGODB_DB || 'bihari_delicacies',
      retryWrites: true,
      w: 'majority'
    });
    mongoConnected = true;
    
    // User Schema
    const userSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: String,
      address: String,
      role: { type: String, enum: ['user', 'seller'], default: 'user' },
      isActive: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    }, { timestamps: true });
    
    // Seller Schema
    const sellerSchema = new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      businessName: { type: String, required: true },
      ownerName: { type: String, required: true },
      email: { type: String, required: true },
      phone: String,
      address: String,
      city: String,
      state: String,
      description: String,
      profileImagePath: String,
      bannerImagePath: String,
      isVerified: { type: Boolean, default: false },
      isActive: { type: Boolean, default: true },
      rating: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 },
      establishedYear: Number,
      specialties: [String],
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    }, { timestamps: true });
    
    // Product Schema
    const productSchema = new mongoose.Schema({
      sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
      name: { type: String, required: true },
      description: String,
      price: { type: Number, required: true },
      originalPrice: Number,
      weight: String,
      ingredients: String,
      shelfLife: String,
      stockQuantity: { type: Number, default: 0 },
      categoryId: Number,
      spiceLevelId: Number,
      mainImagePath: String,
      additionalImages: [String],
      rating: { type: Number, default: 0 },
      reviewCount: { type: Number, default: 0 },
      isFeatured: { type: Boolean, default: false },
      isBestseller: { type: Boolean, default: false },
      isActive: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    }, { timestamps: true });
    
    UserModel = mongoose.models.User || mongoose.model('User', userSchema);
    SellerModel = mongoose.models.Seller || mongoose.model('Seller', sellerSchema);
    ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema);
    
    console.log('[server] MongoDB connected successfully');
  } catch (err) {
    console.warn('[server] MongoDB connection failed, will use fallback storage. Reason:', err?.message || err);
  }
}
// Fire and forget; server continues to start
connectMongoIfConfigured();

// SQLite database setup (optional)
const dbPath = path.join(dataDir, 'app.db');
let db = null;
try {
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS sellers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_name TEXT,
      owner_name TEXT,
      email TEXT,
      phone TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      description TEXT,
      profile_image_path TEXT,
      banner_image_path TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
  console.log('[server] SQLite enabled at', dbPath);
} catch (err) {
  db = null;
  console.warn('[server] SQLite unavailable, falling back to JSON storage. Reason:', err?.message || err);
}

// File uploads setup
const uploadDir = path.join(__dirnameCurrent, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeOriginal = String(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
    const ts = Date.now();
    cb(null, `${ts}-${safeOriginal}`);
  }
});
const upload = multer({ storage });

const tableIdToFile = {
  39097: 'categories.json',
  39098: 'dietary_tags.json',
  39099: 'spice_levels.json',
  39100: 'delivery_options.json',
  39101: 'sellers.json',
  39102: 'products.json',
  39103: 'recipes.json',
  39105: 'recipe_tags.json',
  39112: 'recipe_steps.json'
};

const usersFile = 'users.json';

function readJson(fileName) {
  const filePath = path.join(dataDir, fileName);
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');
  try { return JSON.parse(content || '[]'); } catch { return []; }
}

function writeJson(fileName, data) {
  const filePath = path.join(dataDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function ensureSeed() {
  // Minimal seeds for demo
  if (!fs.existsSync(path.join(dataDir, tableIdToFile[39097]))) {
    writeJson(tableIdToFile[39097], [
      { id: 1, name: 'Sweets & Desserts', description: 'Traditional sweets', image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop' }
    ]);
  }
  if (!fs.existsSync(path.join(dataDir, tableIdToFile[39101]))) {
    writeJson(tableIdToFile[39101], [
      {
        id: 1,
        business_name: 'Mithaiwala Sweets',
        owner_name: 'Ram Prasad Gupta',
        email: 'ram@mithaiwala.com',
        phone: '+91 9876543210',
        address: 'Gandhi Maidan, Patna',
        city: 'Patna',
        state: 'Bihar',
        description: 'Family business serving authentic sweets since 1950',
        profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        banner_image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=300&fit=crop',
        rating: 4.8,
        total_reviews: 156,
        is_verified: true,
        established_year: 1950,
        specialties: 'Khaja, Gur Sandesh, Tilkut'
      }
    ]);
  }
  if (!fs.existsSync(path.join(dataDir, tableIdToFile[39102]))) {
    writeJson(tableIdToFile[39102], [
      {
        id: 1,
        name: 'Authentic Silao Khaja',
        description: 'Traditional layered sweet from Silao',
        price: 350,
        original_price: 400,
        seller_id: 1,
        category_id: 1,
        spice_level_id: 1,
        weight: '500g',
        ingredients: 'Refined flour, Pure ghee, Sugar, Cardamom',
        shelf_life: '15 days',
        stock_quantity: 25,
        rating: 4.8,
        review_count: 45,
        is_featured: true,
        is_bestseller: true,
        main_image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop'
      }
    ]);
  }
  // Create empty files if missing
  [39098, 39099, 39100, 39103, 39105, 39112].forEach((tid) => {
    const f = tableIdToFile[tid];
    const p = path.join(dataDir, f);
    if (!fs.existsSync(p)) writeJson(f, []);
  });
  if (!fs.existsSync(path.join(dataDir, usersFile))) writeJson(usersFile, []);
}

ensureSeed();

async function currentUser(req) {
  const sid = req.cookies.sid;
  if (!sid) return null;
  const userId = sessionIdToUserId.get(sid);
  if (!userId) return null;
  
  try {
    if (mongoConnected && UserModel) {
      const user = await UserModel.findById(userId);
      if (!user) return null;
      return {
        ID: user._id,
        Name: `${user.firstName} ${user.lastName}`,
        Email: user.email,
        Roles: user.role,
        FirstName: user.firstName,
        LastName: user.lastName
      };
    }
    
    // Fallback to JSON storage
    const users = readJson(usersFile);
    return users.find((u) => u.ID === userId) || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Serve uploaded files
app.use('/api/uploads', express.static(path.join(__dirnameCurrent, 'uploads')));

// Generic image upload endpoint (for product images)
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    const url = `/api/uploads/${file.filename}`;
    res.json({ data: { url } });
  } catch (error) {
    console.error('Upload error', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Orders storage
const ordersFile = 'orders.json';
if (!fs.existsSync(path.join(dataDir, ordersFile))) writeJson(ordersFile, []);

app.post('/api/orders', (req, res) => {
  const orders = readJson(ordersFile);
  const order = req.body || {};
  const id = orders.length ? Math.max(...orders.map((o) => o.id || 0)) + 1 : 1;
  const created = { id, createdAt: new Date().toISOString(), ...order };
  orders.push(created);
  writeJson(ordersFile, orders);
  res.json({ data: { id } });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  const { email, password, role, firstName, lastName, phone, address } = req.body || {};
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'Email, password, first name, and last name are required' });
  }
  
  try {
    if (mongoConnected && UserModel) {
      // Check if user already exists
      const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }
      
      // Create new user
      const newUser = new UserModel({
        email: email.toLowerCase(),
        password: String(password), // In production, hash this password
        firstName: String(firstName),
        lastName: String(lastName),
        phone: phone ? String(phone) : undefined,
        address: address ? String(address) : undefined,
        role: role || 'user'
      });
      
      await newUser.save();
      
      // Create session
      const sid = uuidv4();
      sessionIdToUserId.set(sid, newUser._id.toString());
      res.cookie('sid', sid, { httpOnly: true, sameSite: 'lax' });
      
      res.json({ 
        data: { 
          ID: newUser._id, 
          Name: `${newUser.firstName} ${newUser.lastName}`, 
          Email: newUser.email, 
          Roles: newUser.role,
          FirstName: newUser.firstName,
          LastName: newUser.lastName
        } 
      });
      return;
    }
    
    // Fallback to JSON storage
    const users = readJson(usersFile);
    if (users.some((u) => u.Email?.toLowerCase() === String(email).toLowerCase())) {
      return res.status(409).json({ error: 'User already exists' });
    }
    const nextId = users.length ? Math.max(...users.map((u) => u.ID)) + 1 : 1;
    const newUser = {
      ID: nextId,
      Name: `${String(firstName).trim()} ${String(lastName).trim()}`.trim(),
      FirstName: String(firstName),
      LastName: String(lastName),
      Phone: phone ? String(phone) : undefined,
      Address: address ? String(address) : undefined,
      Email: String(email),
      Roles: role || 'user',
      password: String(password)
    };
    users.push(newUser);
    writeJson(usersFile, users);
    const sid = uuidv4();
    sessionIdToUserId.set(sid, newUser.ID);
    res.cookie('sid', sid, { httpOnly: true, sameSite: 'lax' });
    res.json({ data: { ID: newUser.ID, Name: newUser.Name, Email: newUser.Email, Roles: newUser.Roles } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  
  try {
    if (mongoConnected && UserModel) {
      const user = await UserModel.findOne({ email: email.toLowerCase() });
      if (!user || user.password !== String(password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const sid = uuidv4();
      sessionIdToUserId.set(sid, user._id.toString());
      res.cookie('sid', sid, { httpOnly: true, sameSite: 'lax' });
      
      res.json({ 
        data: { 
          ID: user._id, 
          Name: `${user.firstName} ${user.lastName}`, 
          Email: user.email, 
          Roles: user.role,
          FirstName: user.firstName,
          LastName: user.lastName
        } 
      });
      return;
    }
    
    // Fallback to JSON storage
    const users = readJson(usersFile);
    const user = users.find((u) => u.Email?.toLowerCase() === String(email).toLowerCase());
    if (!user || user.password !== String(password)) return res.status(401).json({ error: 'Invalid credentials' });
    const sid = uuidv4();
    sessionIdToUserId.set(sid, user.ID);
    res.cookie('sid', sid, { httpOnly: true, sameSite: 'lax' });
    res.json({ data: { ID: user.ID, Name: user.Name, Email: user.Email, Roles: user.Roles } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  const sid = req.cookies.sid;
  if (sid) sessionIdToUserId.delete(sid);
  res.clearCookie('sid');
  res.json({ data: true });
});

app.get('/api/auth/me', async (req, res) => {
  const user = await currentUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  res.json({ data: { ID: user.ID, Name: user.Name, Email: user.Email, Roles: user.Roles } });
});

// Sellers API
app.post('/api/sellers', upload.fields([
  { name: 'profile_image', maxCount: 1 },
  { name: 'banner_image', maxCount: 1 }
]), async (req, res) => {
  try {
    const user = await currentUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required' });
    
    const body = req.body || {};
    const files = req.files || {};
    const profileImage = Array.isArray(files.profile_image) && files.profile_image[0] ? files.profile_image[0].filename : null;
    const bannerImage = Array.isArray(files.banner_image) && files.banner_image[0] ? files.banner_image[0].filename : null;

    if (mongoConnected && SellerModel) {
      // Check if seller already exists for this user
      const existingSeller = await SellerModel.findOne({ userId: user.ID });
      if (existingSeller) {
        return res.status(409).json({ error: 'Seller profile already exists for this user' });
      }
      
      const created = await SellerModel.create({
        userId: user.ID,
        businessName: body.business_name || body.businessName || null,
        ownerName: body.owner_name || body.ownerName || null,
        email: body.email || user.Email || null,
        phone: body.phone || null,
        address: body.address || null,
        city: body.city || null,
        state: body.state || null,
        description: body.description || null,
        profileImagePath: profileImage ? `/api/uploads/${profileImage}` : null,
        bannerImagePath: bannerImage ? `/api/uploads/${bannerImage}` : null
      });
      res.json({ data: created });
      return;
    }

    // Fallback to JSON storage
    const sellersFile = tableIdToFile[39101];
    const sellers = readJson(sellersFile);
    const nextId = sellers.length ? Math.max(...sellers.map((s) => s.id || 0)) + 1 : 1;
    const created = {
      id: nextId,
      userId: user.ID,
      business_name: body.business_name || body.businessName || null,
      owner_name: body.owner_name || body.ownerName || null,
      email: body.email || user.Email || null,
      phone: body.phone || null,
      address: body.address || null,
      city: body.city || null,
      state: body.state || null,
      description: body.description || null,
      profile_image_path: profileImage ? `/api/uploads/${profileImage}` : null,
      banner_image_path: bannerImage ? `/api/uploads/${bannerImage}` : null,
      created_at: new Date().toISOString()
    };
    sellers.push(created);
    writeJson(sellersFile, sellers);
    res.json({ data: created });
  } catch (error) {
    console.error('Create seller error', error);
    res.status(500).json({ error: 'Failed to create seller' });
  }
});

// Get seller profile for current user
app.get('/api/sellers/me', async (req, res) => {
  try {
    const user = await currentUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required' });
    
    if (mongoConnected && SellerModel) {
      const seller = await SellerModel.findOne({ userId: user.ID });
      if (!seller) return res.status(404).json({ error: 'Seller profile not found' });
      res.json({ data: seller });
      return;
    }
    
    // Fallback to JSON storage
    const sellersFile = tableIdToFile[39101];
    const sellers = readJson(sellersFile);
    const seller = sellers.find(s => s.userId === user.ID);
    if (!seller) return res.status(404).json({ error: 'Seller profile not found' });
    res.json({ data: seller });
  } catch (error) {
    console.error('Get seller error', error);
    res.status(500).json({ error: 'Failed to get seller profile' });
  }
});

// Products API
app.post('/api/products', upload.fields([
  { name: 'main_image', maxCount: 1 },
  { name: 'additional_images', maxCount: 5 }
]), async (req, res) => {
  try {
    const user = await currentUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required' });
    
    // Get seller profile
    let seller = null;
    if (mongoConnected && SellerModel) {
      seller = await SellerModel.findOne({ userId: user.ID });
    } else {
      const sellersFile = tableIdToFile[39101];
      const sellers = readJson(sellersFile);
      seller = sellers.find(s => s.userId === user.ID);
    }
    
    if (!seller) return res.status(404).json({ error: 'Seller profile not found. Please create a seller profile first.' });
    
    const body = req.body || {};
    const files = req.files || {};
    const mainImage = Array.isArray(files.main_image) && files.main_image[0] ? files.main_image[0].filename : null;
    const additionalImages = Array.isArray(files.additional_images) ? 
      files.additional_images.map(file => `/api/uploads/${file.filename}`) : [];

    if (mongoConnected && ProductModel) {
      const created = await ProductModel.create({
        sellerId: seller._id || seller.id,
        name: body.name || null,
        description: body.description || null,
        price: body.price ? parseFloat(body.price) : null,
        originalPrice: body.original_price || body.originalPrice ? parseFloat(body.original_price || body.originalPrice) : null,
        weight: body.weight || null,
        ingredients: body.ingredients || null,
        shelfLife: body.shelf_life || body.shelfLife || null,
        stockQuantity: body.stock_quantity || body.stockQuantity ? parseInt(body.stock_quantity || body.stockQuantity) : 0,
        categoryId: body.category_id || body.categoryId ? parseInt(body.category_id || body.categoryId) : null,
        spiceLevelId: body.spice_level_id || body.spiceLevelId ? parseInt(body.spice_level_id || body.spiceLevelId) : null,
        mainImagePath: mainImage ? `/api/uploads/${mainImage}` : null,
        additionalImages: additionalImages
      });
      res.json({ data: created });
      return;
    }

    // Fallback to JSON storage
    const productsFile = tableIdToFile[39102];
    const products = readJson(productsFile);
    const nextId = products.length ? Math.max(...products.map((p) => p.id || 0)) + 1 : 1;
    const created = {
      id: nextId,
      seller_id: seller._id || seller.id,
      name: body.name || null,
      description: body.description || null,
      price: body.price ? parseFloat(body.price) : null,
      original_price: body.original_price || body.originalPrice ? parseFloat(body.original_price || body.originalPrice) : null,
      weight: body.weight || null,
      ingredients: body.ingredients || null,
      shelf_life: body.shelf_life || body.shelfLife || null,
      stock_quantity: body.stock_quantity || body.stockQuantity ? parseInt(body.stock_quantity || body.stockQuantity) : 0,
      category_id: body.category_id || body.categoryId ? parseInt(body.category_id || body.categoryId) : null,
      spice_level_id: body.spice_level_id || body.spiceLevelId ? parseInt(body.spice_level_id || body.spiceLevelId) : null,
      main_image: mainImage ? `/api/uploads/${mainImage}` : null,
      additional_images: additionalImages,
      created_at: new Date().toISOString()
    };
    products.push(created);
    writeJson(productsFile, products);
    res.json({ data: created });
  } catch (error) {
    console.error('Create product error', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Get products for current seller
app.get('/api/products/me', async (req, res) => {
  try {
    const user = await currentUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required' });
    
    // Get seller profile
    let seller = null;
    if (mongoConnected && SellerModel) {
      seller = await SellerModel.findOne({ userId: user.ID });
    } else {
      const sellersFile = tableIdToFile[39101];
      const sellers = readJson(sellersFile);
      seller = sellers.find(s => s.userId === user.ID);
    }
    
    if (!seller) return res.status(404).json({ error: 'Seller profile not found' });
    
    if (mongoConnected && ProductModel) {
      const products = await ProductModel.find({ sellerId: seller._id });
      res.json({ data: products });
      return;
    }
    
    // Fallback to JSON storage
    const productsFile = tableIdToFile[39102];
    const products = readJson(productsFile);
    const sellerProducts = products.filter(p => p.seller_id === (seller._id || seller.id));
    res.json({ data: sellerProducts });
  } catch (error) {
    console.error('Get products error', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
});

// Table helpers
function applyFilters(items, filters = []) {
  if (!Array.isArray(filters) || filters.length === 0) return items;
  return items.filter((item) => {
    return filters.every((f) => {
      const { name, op, value } = f;
      const fieldValue = item[name];
      switch (op) {
        case 'Equal':
          return fieldValue === value;
        case 'GreaterThanOrEqual':
          return Number(fieldValue) >= Number(value);
        case 'LessThanOrEqual':
          return Number(fieldValue) <= Number(value);
        case 'GreaterThan':
          return Number(fieldValue) > Number(value);
        case 'StringContains':
          return String(fieldValue || '').toLowerCase().includes(String(value).toLowerCase());
        default:
          return true;
      }
    });
  });
}

app.post('/api/table/page/:tableId', (req, res) => {
  const tableId = Number(req.params.tableId);
  const fileName = tableIdToFile[tableId];
  if (!fileName) return res.status(404).json({ error: 'Unknown table' });
  const { PageNo = 1, PageSize = 20, OrderByField = 'id', IsAsc = true, Filters = [] } = req.body || {};
  let items = readJson(fileName);
  items = applyFilters(items, Filters);
  items.sort((a, b) => {
    const av = a[OrderByField];
    const bv = b[OrderByField];
    if (av === bv) return 0;
    if (IsAsc) return av > bv ? 1 : -1;
    return av < bv ? 1 : -1;
  });
  const virtualCount = items.length;
  const start = (PageNo - 1) * PageSize;
  const paged = items.slice(start, start + PageSize);
  res.json({ data: { List: paged, VirtualCount: virtualCount } });
});

app.post('/api/table/create/:tableId', (req, res) => {
  const tableId = Number(req.params.tableId);
  const fileName = tableIdToFile[tableId];
  if (!fileName) return res.status(404).json({ error: 'Unknown table' });
  const record = req.body || {};
  const items = readJson(fileName);
  const nextId = items.length ? Math.max(...items.map((i) => i.id || 0)) + 1 : 1;
  const toSave = { id: nextId, ...record };
  items.push(toSave);
  writeJson(fileName, items);
  res.json({ data: toSave });
});

app.listen(PORT, () => {
  console.log(`[server] API server listening on http://localhost:${PORT}`);
});

