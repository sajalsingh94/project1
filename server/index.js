import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';

// Load environment variables
dotenv.config();

const __dirnameCurrent = path.dirname(new URL(import.meta.url).pathname);
const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-prod';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'change-me-refresh-in-prod';

if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    // Fail fast in production if secrets missing
    console.error('[server] Missing JWT secrets in production');
    process.exit(1);
  }
}

// CORS for Vite dev server
app.use(cors({ origin: [/^http:\/\/localhost:\d+$/, /^http:\/\/\[::\]:\d+$/], credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(rateLimit({ windowMs: 60 * 1000, max: 60, standardHeaders: true, legacyHeaders: false }));

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
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('[server] No MongoDB URI provided, using fallback storage');
    return;
  }
  
  try {
    await mongoose.connect(uri, { 
      dbName: process.env.MONGODB_DB || 'bihari_delicacies',
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      connectTimeoutMS: 10000, // 10 second timeout
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
      isVerified: { type: Boolean, default: false },
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
    console.log('[server] Server will continue running with JSON file storage');
  }
}
// Fire and forget; server continues to start
connectMongoIfConfigured();


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
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    return cb(new Error('Invalid file type'));
  }
});

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
  // Prefer JWT if provided
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
      const userId = decoded.id || decoded.ID || decoded.userId;
      const role = decoded.role || decoded.Roles;
      if (mongoConnected && UserModel && userId) {
        const user = await UserModel.findById(userId);
        if (!user) return null;
        return {
          ID: user._id,
          Name: `${user.firstName} ${user.lastName}`,
          Email: user.email,
          Roles: role || user.role,
          FirstName: user.firstName,
          LastName: user.lastName
        };
      }
      if (userId) {
        const users = readJson(usersFile);
        const jsonUser = users.find((u) => String(u.ID) === String(userId));
        if (jsonUser) return jsonUser;
      }
    } catch {}
  }

  // Fallback to cookie session
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
    if (!file) return res.status(400).json({ success: false, error: 'No file uploaded' });
    const url = `/api/uploads/${file.filename}`;
    res.json({ success: true, data: { url } });
  } catch (error) {
    console.error('Upload error', error);
    res.status(500).json({ success: false, error: 'Failed to upload image' });
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
  res.json({ success: true, data: { id } });
});

// Simple payment simulation - always succeeds
app.post('/api/payments/simulate', (req, res) => {
  try {
    const payload = req.body || {};
    const paymentId = uuidv4();
    res.json({ success: true, data: { success: true, paymentId, echo: payload } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Payment simulation failed' });
  }
});

// Seller Banking Details storage
const sellerBankingFile = 'seller_banking.json';
if (!fs.existsSync(path.join(dataDir, sellerBankingFile))) writeJson(sellerBankingFile, []);

// Get current user's seller banking details
app.get('/api/sellers/banking', async (req, res) => {
  try {
    const user = await currentUser(req);
    if (!user) return res.status(401).json({ success: false, error: 'Authentication required' });
    const items = readJson(sellerBankingFile);
    const record = items.find((i) => i.userId === user.ID);
    if (!record) return res.json({ success: true, data: null });
    res.json({ success: true, data: record });
  } catch (error) {
    console.error('Get banking error', error);
    res.status(500).json({ success: false, error: 'Failed to get banking details' });
  }
});

// Save current user's seller banking details
app.post('/api/sellers/banking', async (req, res) => {
  try {
    const user = await currentUser(req);
    if (!user) return res.status(401).json({ success: false, error: 'Authentication required' });

    const {
      accountHolderName,
      bankAccountNumber,
      ifsc,
      bankName,
      branch,
      taxId
    } = req.body || {};

    // Basic validation
    if (!accountHolderName || !bankAccountNumber || !ifsc || !bankName) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    if (!/^\d{6,18}$/.test(String(bankAccountNumber))) {
      return res.status(400).json({ success: false, error: 'Invalid bank account number' });
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(String(ifsc).toUpperCase())) {
      return res.status(400).json({ success: false, error: 'Invalid IFSC format' });
    }

    const items = readJson(sellerBankingFile);
    const idx = items.findIndex((i) => i.userId === user.ID);
    const payload = {
      userId: user.ID,
      accountHolderName: String(accountHolderName),
      bankAccountNumber: String(bankAccountNumber),
      ifsc: String(ifsc).toUpperCase(),
      bankName: String(bankName),
      branch: branch ? String(branch) : '',
      taxId: taxId ? String(taxId) : '',
      updatedAt: new Date().toISOString()
    };
    if (idx >= 0) {
      items[idx] = { ...items[idx], ...payload };
    } else {
      items.push({ ...payload, createdAt: new Date().toISOString() });
    }
    writeJson(sellerBankingFile, items);
    res.json({ success: true, data: true });
  } catch (error) {
    console.error('Save banking error', error);
    res.status(500).json({ success: false, error: 'Failed to save banking details' });
  }
});

// Auth routes
// Helpers for tokens and email
function signAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}
function signRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}
function setRefreshCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/api/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

function clearRefreshCookie(res) {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie('refresh_token', { httpOnly: true, secure: isProd, sameSite: 'lax', path: '/api/auth' });
}

function buildTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
}

async function sendEmailSafe(options) {
  try {
    const transporter = buildTransport();
    if (!transporter) {
      console.log('[server] SMTP not configured, email would be sent:', options.subject);
      return;
    }
    await transporter.sendMail(options);
  } catch (e) {
    console.warn('[server] Email sending failed:', e?.message || e);
  }
}

app.post('/api/auth/register', async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).max(128).pattern(/[A-Z]/).pattern(/[a-z]/).pattern(/[0-9]/).required(),
      firstName: Joi.string().allow('').optional(),
      lastName: Joi.string().allow('').optional(),
      role: Joi.string().valid('user', 'seller').default('user'),
      phone: Joi.string().allow('').optional(),
      address: Joi.string().allow('').optional()
    });
    const { error, value } = schema.validate(req.body || {});
    if (error) return res.status(400).json({ success: false, error: error.message });

    const { email, password, firstName, lastName, role, phone, address } = value;

    if (mongoConnected && UserModel) {
      const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
      if (existingUser) return res.status(400).json({ success: false, message: 'Email already registered' });

      const hashedPassword = await bcrypt.hash(String(password), 10);
      const newUser = new UserModel({
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName: firstName || '',
        lastName: lastName || '',
        phone: phone || '',
        address: address || '',
        role: role || 'user',
        isVerified: false
      });
      await newUser.save();
      const verifyToken = jwt.sign({ id: newUser._id, action: 'verify' }, JWT_SECRET, { expiresIn: '1d' });
      const base = process.env.APP_BASE_URL || 'http://localhost:5173';
      const link = `${base}/verify-email/${verifyToken}`;
      await sendEmailSafe({ from: process.env.SMTP_FROM || 'noreply@example.com', to: newUser.email, subject: 'Verify your email', text: `Verify your email: ${link}` });
      return res.status(201).json({ success: true, data: { role: newUser.role }, message: 'User registered. Please verify your email.' });
    }

    // Fallback JSON storage
    const users = readJson(usersFile) || [];
    if (users.some((u) => (u.Email || '').toLowerCase() === String(email).toLowerCase())) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(String(password), 10);
    const nextId = users.length ? Math.max(...users.map((u) => u.ID || 0)) + 1 : 1;
    const newUser = {
      ID: nextId,
      Name: `${String(firstName || '').trim()} ${String(lastName || '').trim()}`.trim(),
      FirstName: String(firstName || ''),
      LastName: String(lastName || ''),
      Phone: phone ? String(phone) : '',
      Address: address ? String(address) : '',
      Email: String(email).toLowerCase(),
      Roles: role || 'user',
      password: hashed,
      isVerified: false
    };
    users.push(newUser);
    writeJson(usersFile, users);
    const verifyToken = jwt.sign({ id: newUser.ID, action: 'verify' }, JWT_SECRET, { expiresIn: '1d' });
    const base = process.env.APP_BASE_URL || 'http://localhost:5173';
    const link = `${base}/verify-email/${verifyToken}`;
    await sendEmailSafe({ from: process.env.SMTP_FROM || 'noreply@example.com', to: newUser.Email, subject: 'Verify your email', text: `Verify your email: ${link}` });
    return res.status(201).json({ success: true, data: { role: newUser.Roles }, message: 'User registered. Please verify your email.' });
  } catch (err) {
    console.error('Register error', err);
    return res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ success: false, error: 'Email and password required' });

    if (mongoConnected && UserModel) {
      const user = await UserModel.findOne({ email: String(email).toLowerCase() });
      if (!user) return res.status(400).json({ success: false, error: 'Invalid credentials' });
      const match = await bcrypt.compare(String(password), user.password);
      if (!match) return res.status(400).json({ success: false, error: 'Invalid credentials' });
      const access = signAccessToken({ id: user._id, role: user.role || 'user' });
      const refresh = signRefreshToken({ id: user._id, role: user.role || 'user' });
      setRefreshCookie(res, refresh);
      return res.json({ success: true, data: { token: access, role: user.role || 'user' } });
    }

    const users = readJson(usersFile) || [];
    const user = users.find((u) => String(u.Email).toLowerCase() === String(email).toLowerCase());
    if (!user) return res.status(400).json({ success: false, error: 'Invalid credentials' });
    const match = await bcrypt.compare(String(password), user.password);
    if (!match) return res.status(400).json({ success: false, error: 'Invalid credentials' });
    const access = signAccessToken({ id: user.ID, role: user.Roles || 'user' });
    const refresh = signRefreshToken({ id: user.ID, role: user.Roles || 'user' });
    setRefreshCookie(res, refresh);
    return res.json({ success: true, data: { token: access, role: user.Roles || 'user' } });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ success: false, error: 'Login failed' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  const sid = req.cookies.sid;
  if (sid) sessionIdToUserId.delete(sid);
  res.clearCookie('sid');
  clearRefreshCookie(res);
  res.json({ success: true, data: true });
});

app.get('/api/auth/me', async (req, res) => {
  const user = await currentUser(req);
  if (!user) return res.status(401).json({ success: false, error: 'Not authenticated' });
  res.json({ success: true, data: { ID: user.ID, Name: user.Name, Email: user.Email, Roles: user.Roles } });
});

// Refresh token endpoint
app.post('/api/auth/refresh', async (req, res) => {
  try {
    const token = req.cookies.refresh_token;
    if (!token) return res.status(401).json({ success: false, error: 'No refresh token' });
    let decoded;
    try {
      decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch (e) {
      return res.status(401).json({ success: false, error: 'Invalid refresh token' });
    }
    const access = signAccessToken({ id: decoded.id, role: decoded.role });
    // Optionally rotate refresh token
    const refresh = signRefreshToken({ id: decoded.id, role: decoded.role });
    setRefreshCookie(res, refresh);
    return res.json({ success: true, data: { token: access } });
  } catch (e) {
    console.error('Refresh error', e);
    return res.status(500).json({ success: false, error: 'Failed to refresh token' });
  }
});

// Forgot password
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { error, value } = schema.validate(req.body || {});
    if (error) return res.status(400).json({ success: false, error: error.message });
    const email = String(value.email).toLowerCase();
    let userId = null;
    if (mongoConnected && UserModel) {
      const user = await UserModel.findOne({ email });
      if (user) userId = user._id;
    } else {
      const users = readJson(usersFile);
      const u = users.find((x) => String(x.Email).toLowerCase() === email);
      if (u) userId = u.ID;
    }
    // Always respond success to avoid user enumeration
    if (userId) {
      const token = jwt.sign({ id: userId, action: 'reset' }, JWT_SECRET, { expiresIn: '1h' });
      const base = process.env.APP_BASE_URL || 'http://localhost:5173';
      const link = `${base}/reset-password/${token}`;
      await sendEmailSafe({ from: process.env.SMTP_FROM || 'noreply@example.com', to: email, subject: 'Reset your password', text: `Reset link: ${link}` });
    }
    return res.json({ success: true, data: true });
  } catch (e) {
    console.error('Forgot password error', e);
    return res.status(500).json({ success: false, error: 'Failed to process request' });
  }
});

// Reset password
app.post('/api/auth/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid or expired token' });
    }
    if (decoded.action !== 'reset') return res.status(400).json({ success: false, error: 'Invalid token action' });
    const schema = Joi.object({ password: Joi.string().min(8).max(128).pattern(/[A-Z]/).pattern(/[a-z]/).pattern(/[0-9]/).required() });
    const { error, value } = schema.validate(req.body || {});
    if (error) return res.status(400).json({ success: false, error: error.message });
    const hashed = await bcrypt.hash(String(value.password), 10);
    if (mongoConnected && UserModel) {
      await UserModel.findByIdAndUpdate(decoded.id, { password: hashed });
    } else {
      const users = readJson(usersFile);
      const idx = users.findIndex((u) => String(u.ID) === String(decoded.id));
      if (idx >= 0) {
        users[idx].password = hashed;
        writeJson(usersFile, users);
      }
    }
    return res.json({ success: true, data: true });
  } catch (e) {
    console.error('Reset password error', e);
    return res.status(500).json({ success: false, error: 'Failed to reset password' });
  }
});

// Verify email
app.get('/api/auth/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid or expired token' });
    }
    if (decoded.action !== 'verify') return res.status(400).json({ success: false, error: 'Invalid token action' });
    if (mongoConnected && UserModel) {
      await UserModel.findByIdAndUpdate(decoded.id, { isVerified: true });
    } else {
      const users = readJson(usersFile);
      const idx = users.findIndex((u) => String(u.ID) === String(decoded.id));
      if (idx >= 0) {
        users[idx].isVerified = true;
        writeJson(usersFile, users);
      }
    }
    return res.json({ success: true, data: true });
  } catch (e) {
    console.error('Verify email error', e);
    return res.status(500).json({ success: false, error: 'Failed to verify email' });
  }
});

// Minimal seller routes for JWT-protected endpoints used by axios in simple pages
// Mount JWT-protected seller routes
import sellerRoutes from './routes/seller.js';
app.use('/api/seller', sellerRoutes);

// Sellers API
app.post('/api/sellers', upload.fields([
  { name: 'profile_image', maxCount: 1 },
  { name: 'banner_image', maxCount: 1 }
]), async (req, res) => {
  try {
    const user = await currentUser(req);
    if (!user) return res.status(401).json({ success: false, error: 'Authentication required' });
    
    const body = req.body || {};
    const files = req.files || {};
    const profileImage = Array.isArray(files.profile_image) && files.profile_image[0] ? files.profile_image[0].filename : null;
    const bannerImage = Array.isArray(files.banner_image) && files.banner_image[0] ? files.banner_image[0].filename : null;

    if (mongoConnected && SellerModel) {
      // Check if seller already exists for this user
      const existingSeller = await SellerModel.findOne({ userId: user.ID });
      if (existingSeller) {
        return res.status(409).json({ success: false, error: 'Seller profile already exists for this user' });
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
      res.json({ success: true, data: created });
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
    res.json({ success: true, data: created });
  } catch (error) {
    console.error('Create seller error', error);
    res.status(500).json({ success: false, error: 'Failed to create seller' });
  }
});

// Get seller profile for current user
app.get('/api/sellers/me', async (req, res) => {
  try {
    const user = await currentUser(req);
    if (!user) return res.status(401).json({ success: false, error: 'Authentication required' });
    
    if (mongoConnected && SellerModel) {
      const seller = await SellerModel.findOne({ userId: user.ID });
      if (!seller) return res.status(404).json({ success: false, error: 'Seller profile not found' });
      res.json({ success: true, data: seller });
      return;
    }
    
    // Fallback to JSON storage
    const sellersFile = tableIdToFile[39101];
    const sellers = readJson(sellersFile);
    const seller = sellers.find(s => s.userId === user.ID);
    if (!seller) return res.status(404).json({ success: false, error: 'Seller profile not found' });
    res.json({ success: true, data: seller });
  } catch (error) {
    console.error('Get seller error', error);
    res.status(500).json({ success: false, error: 'Failed to get seller profile' });
  }
});

// Products API
app.post('/api/products', upload.fields([
  { name: 'main_image', maxCount: 1 },
  { name: 'additional_images', maxCount: 5 }
]), async (req, res) => {
  try {
    const user = await currentUser(req);
    if (!user) return res.status(401).json({ success: false, error: 'Authentication required' });
    
    // Get seller profile
    let seller = null;
    if (mongoConnected && SellerModel) {
      seller = await SellerModel.findOne({ userId: user.ID });
    } else {
      const sellersFile = tableIdToFile[39101];
      const sellers = readJson(sellersFile);
      seller = sellers.find(s => s.userId === user.ID);
    }
    
    if (!seller) return res.status(404).json({ success: false, error: 'Seller profile not found. Please create a seller profile first.' });
    
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
      res.json({ success: true, data: created });
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
    res.json({ success: true, data: created });
  } catch (error) {
    console.error('Create product error', error);
    res.status(500).json({ success: false, error: 'Failed to create product' });
  }
});

// Get products for current seller
app.get('/api/products/me', async (req, res) => {
  try {
    const user = await currentUser(req);
    if (!user) return res.status(401).json({ success: false, error: 'Authentication required' });
    
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
      res.json({ success: true, data: products });
      return;
    }
    
    // Fallback to JSON storage
    const productsFile = tableIdToFile[39102];
    const products = readJson(productsFile);
    const sellerProducts = products.filter(p => p.seller_id === (seller._id || seller.id));
    res.json({ success: true, data: sellerProducts });
  } catch (error) {
    console.error('Get products error', error);
    res.status(500).json({ success: false, error: 'Failed to get products' });
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
  if (!fileName) return res.status(404).json({ success: false, error: 'Unknown table' });
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
  res.json({ success: true, data: { List: paged, VirtualCount: virtualCount } });
});

app.post('/api/table/create/:tableId', (req, res) => {
  const tableId = Number(req.params.tableId);
  const fileName = tableIdToFile[tableId];
  if (!fileName) return res.status(404).json({ success: false, error: 'Unknown table' });
  const record = req.body || {};
  const items = readJson(fileName);
  const nextId = items.length ? Math.max(...items.map((i) => i.id || 0)) + 1 : 1;
  const toSave = { id: nextId, ...record };
  items.push(toSave);
  writeJson(fileName, items);
  res.json({ success: true, data: toSave });
});

app.listen(PORT, () => {
  console.log(`[server] API server listening on http://localhost:${PORT}`);
});

