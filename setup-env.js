#!/usr/bin/env node

/**
 * Environment Setup Script
 * 
 * This script automatically creates a .env file from .env.example
 * if it doesn't exist. This prevents the "MongoDB URI missing" error
 * that occurs when switching branches or after git operations.
 */

import fs from 'fs';
import path from 'path';

const envPath = '.env';
const envExamplePath = '.env.example';

function setupEnvironment() {
  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    console.log('✅ .env file already exists');
    return;
  }

  // Check if .env.example exists
  if (!fs.existsSync(envExamplePath)) {
    console.error('❌ .env.example file not found');
    process.exit(1);
  }

  try {
    // Copy .env.example to .env
    const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');
    fs.writeFileSync(envPath, envExampleContent);
    
    console.log('✅ Created .env file from .env.example');
    console.log('📝 You can now edit .env to customize your configuration');
  } catch (error) {
    console.error('❌ Failed to create .env file:', error.message);
    process.exit(1);
  }
}

setupEnvironment();