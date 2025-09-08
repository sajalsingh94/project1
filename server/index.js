import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

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

function currentUser(req) {
  const sid = req.cookies.sid;
  if (!sid) return null;
  const userId = sessionIdToUserId.get(sid);
  if (!userId) return null;
  const users = readJson(usersFile);
  return users.find((u) => u.ID === userId) || null;
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
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
app.post('/api/auth/register', (req, res) => {
  const { email, password, role } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  const users = readJson(usersFile);
  if (users.some((u) => u.Email?.toLowerCase() === String(email).toLowerCase())) {
    return res.status(409).json({ error: 'User already exists' });
  }
  const newUser = {
    ID: users.length ? Math.max(...users.map((u) => u.ID)) + 1 : 1,
    Name: String(email).split('@')[0],
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
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  const users = readJson(usersFile);
  const user = users.find((u) => u.Email?.toLowerCase() === String(email).toLowerCase());
  if (!user || user.password !== String(password)) return res.status(401).json({ error: 'Invalid credentials' });
  const sid = uuidv4();
  sessionIdToUserId.set(sid, user.ID);
  res.cookie('sid', sid, { httpOnly: true, sameSite: 'lax' });
  res.json({ data: { ID: user.ID, Name: user.Name, Email: user.Email, Roles: user.Roles } });
});

app.post('/api/auth/logout', (req, res) => {
  const sid = req.cookies.sid;
  if (sid) sessionIdToUserId.delete(sid);
  res.clearCookie('sid');
  res.json({ data: true });
});

app.get('/api/auth/me', (req, res) => {
  const user = currentUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  res.json({ data: { ID: user.ID, Name: user.Name, Email: user.Email, Roles: user.Roles } });
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

