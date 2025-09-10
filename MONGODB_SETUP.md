# Database Setup Guide

## ✅ Current Status: MONGODB ATLAS CONFIGURED & PROTECTED

Your application is now configured with MongoDB Atlas and working perfectly! The server connects to your MongoDB Atlas cluster for data storage.

## 🔒 ENVIRONMENT FILE PROTECTION

Your `.env` file is now protected with multiple safeguards:
- ✅ **File permissions set to 600** (owner read/write only)
- ✅ **Backup created** (`.env.backup`)
- ✅ **Git ignored** (won't be committed to version control)
- ✅ **Protection script** (`./protect-env.sh`) to verify configuration

## How It Works

The application has a **smart fallback system**:

1. **Primary**: MongoDB (if configured)
2. **Fallback**: JSON file storage (current default)

## Current Configuration

The application is set up with:
- **MongoDB Atlas** = Connected to your cloud database
- **Port 3001** = Server runs on http://localhost:3001
- **Data storage** = All data saved to MongoDB Atlas cluster
- **Database name** = `bihari_delicacies`

## Server Output

When you run `pnpm run dev:server`, you'll see:
```
[server] MongoDB connected successfully
[server] API server listening on http://localhost:3001
```

This confirms that MongoDB Atlas is connected and working perfectly!

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

## 🔒 Protecting Your .env File

### Automatic Protection
Your `.env` file is automatically protected, but if you need to restore it:

```bash
# Check if .env file is properly configured
./protect-env.sh

# If .env gets deleted or corrupted, restore from backup
cp .env.backup .env
chmod 600 .env
```

### Manual Protection
If you need to edit the `.env` file:

1. **Never comment out the MONGODB_URI line**
2. **Keep the file permissions as 600**
3. **Always create a backup before making changes**
4. **Test the connection after any changes**

### Current Configuration
```bash
# Your current .env file contains:
MONGODB_URI=mongodb+srv://sajalsingh94_db_user:asdwer@cluster1.vzdx6lp.mongodb.net/?retryWrites=true&w=majority&appName=cluster1
MONGODB_DB=bihari_delicacies
PORT=3001
```

## Troubleshooting

- **"MongoDB connection failed"**: Check your internet connection and MongoDB Atlas cluster status
- **Server won't start**: Check if port 3001 is available
- **Data not saving**: Verify MongoDB Atlas connection and database permissions
- **".env file missing"**: Run `./protect-env.sh` to restore from backup

## Summary

**MongoDB Atlas is now configured and working!** Your application is connected to a cloud database and ready for production use. All data is automatically saved to your MongoDB Atlas cluster.