# MongoDB Setup Guide

## Current Status
✅ **Server is now working!** The application will run with JSON file storage as fallback when MongoDB is not available.

## The Problem
Your MongoDB Atlas cluster is rejecting connections because your current IP address is not whitelisted. This is a common security feature in MongoDB Atlas.

## Solutions

### Option 1: Fix MongoDB Atlas IP Whitelist (Recommended for Production)

1. **Get your current IP address:**
   ```bash
   curl -s https://api.ipify.org
   ```

2. **Add your IP to MongoDB Atlas:**
   - Go to [MongoDB Atlas Console](https://cloud.mongodb.com)
   - Navigate to your cluster
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Add your current IP address (or use `0.0.0.0/0` for development - **NOT recommended for production**)

3. **Update your connection string if needed:**
   - Edit the `.env` file with your correct MongoDB URI
   - Make sure the username and password are correct

### Option 2: Use Local MongoDB (For Development)

1. **Install MongoDB locally:**
   ```bash
   # On Ubuntu/Debian
   sudo apt-get install mongodb
   
   # On macOS with Homebrew
   brew install mongodb-community
   ```

2. **Update your `.env` file:**
   ```
   MONGODB_URI=mongodb://localhost:27017/bihari_delicacies
   MONGODB_DB=bihari_delicacies
   ```

### Option 3: Continue with JSON Storage (Current Working State)

The application is already working with JSON file storage. All data will be stored in the `server/data/` directory as JSON files. This is perfect for development and testing.

## Environment Variables

The application now uses environment variables for configuration. See `.env.example` for the required variables:

- `MONGODB_URI`: Your MongoDB connection string
- `MONGODB_DB`: Your database name
- `PORT`: Server port (default: 3001)

## Running the Application

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Or start components separately
pnpm run dev:server  # Backend API server
pnpm run dev:web     # Frontend development server
```

## Data Storage

- **With MongoDB**: Data is stored in MongoDB collections
- **Without MongoDB**: Data is stored in JSON files in `server/data/` directory
- **SQLite**: Available as an additional fallback (currently disabled due to build issues)

## Troubleshooting

1. **Server won't start**: Check if port 3001 is available
2. **MongoDB connection fails**: Check your IP whitelist and connection string
3. **Data not persisting**: Ensure the `server/data/` directory is writable

## Next Steps

1. Choose one of the MongoDB setup options above
2. Update your `.env` file accordingly
3. Restart the server to test the connection
4. For production, always use MongoDB with proper security settings