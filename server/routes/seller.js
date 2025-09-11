import express from 'express';
import Joi from 'joi';
import { authMiddleware, sellerOnly } from '../middleware/auth.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Determine data directory relative to server/index.js execution dir
const __dirnameCurrent = path.dirname(new URL(import.meta.url).pathname);
const dataDir = path.join(path.dirname(__dirnameCurrent), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const shopFile = path.join(dataDir, 'shops.json');
const banksFile = path.join(dataDir, 'banks.json');
if (!fs.existsSync(shopFile)) fs.writeFileSync(shopFile, '[]');
if (!fs.existsSync(banksFile)) fs.writeFileSync(banksFile, '[]');

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return [];
  try { return JSON.parse(fs.readFileSync(filePath, 'utf-8') || '[]'); } catch { return []; }
}
function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

router.post('/shop-details', authMiddleware, sellerOnly, async (req, res) => {
  try {
    const schema = Joi.object({
      shopName: Joi.string().min(1).required(),
      address: Joi.string().required(),
      category: Joi.string().required()
    });
    const { error, value } = schema.validate(req.body || {});
    if (error) return res.status(400).json({ success: false, message: error.message });

    if (typeof globalThis.ShopModel !== 'undefined' && globalThis.ShopModel) {
      const newShop = new globalThis.ShopModel({ userId: req.user.id, ...value });
      await newShop.save();
      return res.json({ success: true, message: 'Shop details saved', data: newShop });
    }

    const shops = readJson(shopFile);
    const record = { id: shops.length ? Math.max(...shops.map((s) => s.id || 0)) + 1 : 1, userId: req.user.id, ...value };
    shops.push(record);
    writeJson(shopFile, shops);
    return res.json({ success: true, message: 'Shop saved', data: record });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Failed to save shop details' });
  }
});

router.post('/banking-details', authMiddleware, sellerOnly, async (req, res) => {
  try {
    const schema = Joi.object({
      accountNumber: Joi.string().min(6).required(),
      ifsc: Joi.string().min(4).required(),
      bankName: Joi.string().required()
    });
    const { error, value } = schema.validate(req.body || {});
    if (error) return res.status(400).json({ success: false, message: error.message });

    if (typeof globalThis.BankingModel !== 'undefined' && globalThis.BankingModel) {
      const newBank = new globalThis.BankingModel({ userId: req.user.id, ...value });
      await newBank.save();
      return res.json({ success: true, message: 'Bank details saved', data: { ...newBank.toObject(), accountNumber: '****' + String(newBank.accountNumber).slice(-4) } });
    }

    const banks = readJson(banksFile);
    const record = { id: banks.length ? Math.max(...banks.map((s) => s.id || 0)) + 1 : 1, userId: req.user.id, ...value };
    banks.push(record);
    writeJson(banksFile, banks);
    return res.json({ success: true, message: 'Bank saved', data: { ...record, accountNumber: '****' + String(record.accountNumber).slice(-4) } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Failed to save bank details' });
  }
});

export default router;

