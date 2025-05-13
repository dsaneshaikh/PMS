// This script generates MongoDB commands for an admin user based on actual backend schemas
// For ES modules, we use bcrypt via import
import bcrypt from 'bcrypt';

// Admin user settings - CHANGE THESE AS NEEDED
const settings = {
  username: 'admin',
  password: 'admin123',  // This will be hashed
  saltRounds: 10,        // Standard salt rounds for bcrypt
};

// Permission and role settings
const permissions = [
  { name: 'View Dashboard', description: 'Access to view the dashboard' },
  { name: 'Manage Users', description: 'Create, update, delete users' },
  { name: 'Manage Roles', description: 'Create, update, delete roles' },
  { name: 'Manage Permissions', description: 'Create, update, delete permissions' }
];

const adminRole = {
  name: 'Administrator',
  // The permissions array will be populated with ObjectIds in the MongoDB commands
};

// Generate MongoDB commands based on the actual schemas
async function generateAdminData() {
  try {
    // Hash the password according to the userSchema which has passwordHash field
    const passwordHash = await bcrypt.hash(settings.password, settings.saltRounds);
    
    // Current timestamps for createdAt and updatedAt
    const now = new Date();
    const timestamp = { createdAt: now, updatedAt: now };
    
    // Output header
    console.log('\n=== MONGODB COMMANDS FOR ADMIN SETUP ===\n');
    console.log('// Run these commands in MongoDB Shell\n');
    
    // 1. Create permissions first
    console.log('// 1. Create Permissions');
    for (const perm of permissions) {
      console.log(`db.permissions.insertOne({
  name: "${perm.name}",
  description: "${perm.description}"
});`);
    }
    
    console.log('\n// Store the permission IDs for later use');
    console.log(`const viewDashboardId = db.permissions.findOne({ name: "${permissions[0].name}" })._id;`);
    console.log(`const manageUsersId = db.permissions.findOne({ name: "${permissions[1].name}" })._id;`);
    console.log(`const manageRolesId = db.permissions.findOne({ name: "${permissions[2].name}" })._id;`);
    console.log(`const managePermissionsId = db.permissions.findOne({ name: "${permissions[3].name}" })._id;`);
    
    // 2. Create admin role with permissions
    console.log('\n// 2. Create Admin Role with Permissions');
    console.log(`db.roles.insertOne({
  name: "${adminRole.name}",
  permissions: [viewDashboardId, manageUsersId, manageRolesId, managePermissionsId],
  createdAt: new Date(),
  updatedAt: new Date()
});`);
    
    console.log('\n// Store the role ID');
    console.log(`const adminRoleId = db.roles.findOne({ name: "${adminRole.name}" })._id;`);
    
    // 3. Create admin user with role
    console.log('\n// 3. Create Admin User with Role');
    console.log(`db.users.insertOne({
  username: "${settings.username}",
  passwordHash: "${passwordHash}",
  roles: [adminRoleId],
  createdAt: new Date(),
  updatedAt: new Date()
});`);
    
    // 4. Verification
    console.log('\n// 4. Verify Setup by Finding the Admin User');
    console.log(`db.users.findOne({ username: "${settings.username}" }).pretty();`);
    
    // 5. Login information
    console.log('\n=== ADMIN LOGIN CREDENTIALS ===');
    console.log(`Username: ${settings.username}`);
    console.log(`Password: ${settings.password} (clear text, not stored in database)`);
    console.log('PasswordHash: ' + passwordHash.substring(0, 20) + '... (stored in database)\n');
    
  } catch (error) {
    console.error('Error generating admin data:', error);
  }
}

// Run the function
generateAdminData();

// Usage instructions
console.log('=== HOW TO USE ===');
console.log('1. Make sure MongoDB is running');
console.log('2. Copy the MongoDB commands above to create permissions, roles and admin user');
console.log('3. Run the commands in MongoDB Shell or MongoDB Compass');
console.log('4. Use the provided admin credentials to log in to your application');
console.log('\nNote: These commands are specifically designed to match your backend model schemas.')
