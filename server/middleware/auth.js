import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-prod';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return res.status(401).json({ success: false, error: 'No token provided' });
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

export function sellerOnly(req, res, next) {
  if (!req.user) return res.status(401).json({ success: false, error: 'Not authenticated' });
  if (req.user.role !== 'seller') return res.status(403).json({ success: false, error: 'Sellers only' });
  return next();
}

export function buyerOnly(req, res, next) {
  if (!req.user) return res.status(401).json({ success: false, error: 'Not authenticated' });
  if (req.user.role !== 'user') return res.status(403).json({ success: false, error: 'Buyers only' });
  return next();
}

