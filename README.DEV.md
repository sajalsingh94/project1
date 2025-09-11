# Development README

## Prereqs
- Node 18+
- pnpm

## Backend
```
cp .env.example .env
# edit .env to set JWT_SECRET & MONGODB_URI if using Mongo
pnpm install
pnpm run dev
```

Server runs on PORT from env (default 5000 in .env.example).

## Frontend
```
pnpm install
pnpm run dev
```

Vite dev server runs (default 5173).

## Auth API examples

Register:
```
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"Password1","role":"seller"}'
```

Login:
```
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"Password1"}'
```

## Seller endpoints (JWT required)

Shop details:
```
curl -X POST http://localhost:5000/api/seller/shop-details -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{"shopName":"My Shop","address":"Patna","category":"Sweets"}'
```

Banking details:
```
curl -X POST http://localhost:5000/api/seller/banking-details -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{"accountNumber":"12345678","ifsc":"ABCD0123456","bankName":"SBI"}'
```

## Notes
- Registration no longer auto-logs in. Use Login to obtain JWT.
- Frontend stores token in localStorage and injects Authorization header automatically.
- Seller pages are protected client-side; backend validates JWT and role.

