# Database Setup Guide

## ✅ Current Status: WORKING OUT OF THE BOX

Your application is configured to work immediately without any setup required. The server uses JSON file storage by default, which is perfect for development and testing.

## How It Works

The application has a **smart fallback system**:

1. **Primary**: MongoDB (if configured)
2. **Fallback**: JSON file storage (current default)

## Current Configuration

The application is set up with:
- **No MongoDB URI** = Uses JSON file storage (recommended for development)
- **Port 3001** = Server runs on http://localhost:3001
- **Data storage** = All data saved in `server/data/` directory

## Server Output

When you run `pnpm run dev:server`, you'll see:
```
[server] No MongoDB URI provided, using fallback storage
[server] API server listening on http://localhost:3001
```

This is **normal and expected** - your app is working perfectly! This message indicates the app is using JSON file storage instead of MongoDB.

## Optional: Enable MongoDB

If you want to use MongoDB instead of JSON files:

### Option 1: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a cluster and get your connection string
3. Edit `.env` file and uncomment the MONGODB_URI line:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=cluster
   ```

### Option 2: Local MongoDB
1. Install MongoDB locally
2. Edit `.env` file and uncomment the local MongoDB line:
   ```
   MONGODB_URI=mongodb://localhost:27017/bihari_delicacies
   ```

## Environment Files

- **`.env`** - Your local environment configuration
- **`.gitignore`** - Excludes `.env` from version control (for security)

## Data Storage Locations

- **JSON files**: `server/data/` directory
- **MongoDB**: Cloud or local MongoDB database
- **Uploads**: `server/uploads/` directory

## Running the Application

```bash
# Install dependencies (if not done already)
pnpm install

# Start the full application
pnpm run dev

# Or start components separately
pnpm run dev:server  # Backend API server
pnpm run dev:web     # Frontend development server
```

## Troubleshooting

- **"MongoDB URI missing"**: This is normal! The app works without MongoDB using JSON file storage
- **Server won't start**: Check if port 3001 is available
- **Data not saving**: Check that `server/data/` directory is writable

## Summary

**You don't need to do anything!** The application is configured to work out of the box with JSON file storage. MongoDB is completely optional and only needed if you want to scale to production with a proper database.