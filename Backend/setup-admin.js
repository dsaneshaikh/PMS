// Backend script to create admin user with permissions and roles
// Run with: node setup-admin.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import models
const User = require('./models/admin/userSchema');
const Role = require('./models/admin/roleSchema');
const Permission = require('./models/admin/permssionSchema');

// Admin user configuration (customize as needed)
const adminConfig = {
  username: 'admin',
  password: 'admin123',
  isAdmin: true
};

// Basic permissions to create
const defaultPermissions = [
  { name: 'View Dashboard', description: 'Access to view the dashboard' },
  { name: 'Manage Users', description: 'Create, update, delete users' },
  { name: 'Manage Roles', description: 'Create, update, delete roles' },
  { name: 'Manage Permissions', description: 'Create, update, delete permissions' }
];

// Admin role configuration
const adminRole = {
  name: 'Administrator',
  description: 'Full system access'
};

// Connect to MongoDB
async function connectToDatabase() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pms';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Create permissions if they don't exist
async function createPermissions() {
  const permissionIds = [];
  
  for (const perm of defaultPermissions) {
    // Check if permission already exists
    let permission = await Permission.findOne({ name: perm.name });
    
    if (!permission) {
      // Create new permission
      permission = await Permission.create(perm);
      console.log(`Created permission: ${perm.name}`);
    } else {
      console.log(`Permission already exists: ${perm.name}`);
    }
    
    permissionIds.push(permission._id);
  }
  
  return permissionIds;
}

// Create admin role if it doesn't exist
async function createAdminRole(permissionIds) {
  // Check if admin role already exists
  let adminRoleDoc = await Role.findOne({ name: adminRole.name });
  
  if (!adminRoleDoc) {
    // Create admin role with all permissions
    adminRoleDoc = await Role.create({
      name: adminRole.name,
      permissions: permissionIds
    });
    console.log(`Created role: ${adminRole.name}`);
  } else {
    // Update existing admin role with all permissions
    adminRoleDoc.permissions = permissionIds;
    await adminRoleDoc.save();
    console.log(`Updated existing role: ${adminRole.name}`);
  }
  
  return adminRoleDoc._id;
}

// Create admin user if it doesn't exist
async function createAdminUser(roleId) {
  // Check if admin user already exists
  let adminUser = await User.findOne({ username: adminConfig.username });
  
  if (!adminUser) {
    // Hash password
    const passwordHash = await bcrypt.hash(adminConfig.password, 10);
    
    // Create admin user
    adminUser = await User.create({
      username: adminConfig.username,
      passwordHash: passwordHash,
      roles: [roleId],
      isAdmin: adminConfig.isAdmin
    });
    console.log(`Created admin user: ${adminConfig.username}`);
  } else {
    console.log(`Admin user already exists: ${adminConfig.username}`);
  }
  
  return adminUser;
}

// Main setup function
async function setupAdmin() {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Create permissions
    const permissionIds = await createPermissions();
    
    // Create admin role
    const roleId = await createAdminRole(permissionIds);
    
    // Create admin user
    const adminUser = await createAdminUser(roleId);
    
    console.log('\n=== ADMIN SETUP COMPLETE ===');
    console.log(`Username: ${adminConfig.username}`);
    console.log(`Password: ${adminConfig.password}`);
    console.log(`Role: ${adminRole.name}`);
    console.log('Permissions: ' + defaultPermissions.map(p => p.name).join(', '));
    
    // Disconnect from database
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Setup error:', error);
  }
}

// Run the setup
setupAdmin();
