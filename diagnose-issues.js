// Diagnostic script to check common issues
const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnosing Blog Application Issues...\n');

// Check 1: Server files exist
console.log('1. Checking server files...');
const serverFiles = [
  'server/src/index.js',
  'server/src/routes/posts.js',
  'server/src/routes/auth.js',
  'server/src/models/Post.js',
  'server/src/models/User.js',
  'server/src/config/database.js',
  'server/package.json',
  'server/config.env'
];

serverFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Check 2: Frontend files exist
console.log('\n2. Checking frontend files...');
const frontendFiles = [
  'src/App.js',
  'src/AuthContext.js',
  'src/services/posts.js',
  'src/pages/Login.js',
  'src/pages/Posts.js',
  'src/pages/PostEditor.js',
  'src/pages/PostDetail.js',
  'src/pages/Profile.js',
  'src/pages/MyHistory.js',
  'package.json'
];

frontendFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Check 3: Package.json dependencies
console.log('\n3. Checking dependencies...');
try {
  const serverPkg = JSON.parse(fs.readFileSync('server/package.json', 'utf8'));
  const requiredDeps = ['express', 'mongoose', 'bcryptjs', 'jsonwebtoken', 'cors', 'cookie-parser'];
  
  requiredDeps.forEach(dep => {
    if (serverPkg.dependencies && serverPkg.dependencies[dep]) {
      console.log(`✅ ${dep} installed in server`);
    } else {
      console.log(`❌ ${dep} missing in server`);
    }
  });
} catch (e) {
  console.log('❌ Error reading server package.json:', e.message);
}

try {
  const frontendPkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['react', 'react-router-dom'];
  
  requiredDeps.forEach(dep => {
    if (frontendPkg.dependencies && frontendPkg.dependencies[dep]) {
      console.log(`✅ ${dep} installed in frontend`);
    } else {
      console.log(`❌ ${dep} missing in frontend`);
    }
  });
} catch (e) {
  console.log('❌ Error reading frontend package.json:', e.message);
}

// Check 4: Environment variables
console.log('\n4. Checking environment variables...');
try {
  const envContent = fs.readFileSync('server/config.env', 'utf8');
  const requiredVars = ['PORT', 'CLIENT_ORIGIN', 'JWT_SECRET', 'MONGODB_URI'];
  
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`✅ ${varName} defined`);
    } else {
      console.log(`❌ ${varName} missing`);
    }
  });
} catch (e) {
  console.log('❌ Error reading config.env:', e.message);
}

// Check 5: MongoDB connection string
console.log('\n5. Checking MongoDB configuration...');
try {
  const envContent = fs.readFileSync('server/config.env', 'utf8');
  if (envContent.includes('mongodb://localhost:27017')) {
    console.log('✅ MongoDB configured for local connection');
  } else {
    console.log('❌ MongoDB not configured for local connection');
  }
} catch (e) {
  console.log('❌ Error checking MongoDB config:', e.message);
}

console.log('\n🔧 Common Solutions:');
console.log('1. Make sure MongoDB is running: mongod');
console.log('2. Install dependencies: npm install (in both root and server directories)');
console.log('3. Check if ports 3000 and 4000 are available');
console.log('4. Verify all files are in the correct locations');
console.log('5. Check browser console for JavaScript errors');
console.log('6. Check server terminal for error messages');

console.log('\n📋 Next Steps:');
console.log('1. Run: cd server && npm install');
console.log('2. Run: cd .. && npm install');
console.log('3. Start MongoDB service');
console.log('4. Run: npm run dev (from root directory)');
console.log('5. Open: http://localhost:3000');
