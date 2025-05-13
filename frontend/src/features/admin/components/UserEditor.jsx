import { useState, useEffect } from "react";
import { getAllRoles } from "../../../../services/roles";
import { updateUserRoles, updatePassword } from "../../../../services/user";

function UserEditor({ user, onClose, onUserUpdated }) {
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordUpdateMode, setPasswordUpdateMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Load all available roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getAllRoles();
        setRoles(rolesData);
        
        // Initialize selected roles based on user's current roles
        if (user && user.roles) {
          setSelectedRoles(
            user.roles.map(role => role._id || role.id)
          );
        }
      } catch (err) {
        console.error("Failed to load roles:", err);
        setError("Failed to load roles");
      }
    };
    
    fetchRoles();
  }, [user]);

  const handleRoleToggle = (roleId) => {
    setSelectedRoles(prev => {
      if (prev.includes(roleId)) {
        return prev.filter(id => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };

  const handleUpdateRoles = async () => {
    if (!user || !user.username) return;
    
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      await updateUserRoles({
        username: user.username,
        roles: selectedRoles
      });
      
      setSuccessMessage("User roles updated successfully");
      if (onUserUpdated) onUserUpdated();
    } catch (err) {
      console.error("Failed to update roles:", err);
      setError(err.message || "Failed to update user roles");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!user || !user.username) return;
    if (!newPassword) {
      setError("Password cannot be empty");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      await updatePassword({
        username: user.username,
        password: newPassword
      });
      
      setSuccessMessage("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordUpdateMode(false);
      if (onUserUpdated) onUserUpdated();
    } catch (err) {
      console.error("Failed to update password:", err);
      setError(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit User: {user?.username}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 p-3 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 bg-green-100 p-3 rounded text-green-700 text-sm">
            {successMessage}
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Update Roles</h3>
          <div className="max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-md">
            {roles.length === 0 ? (
              <p className="text-gray-500">No roles available</p>
            ) : (
              roles.map((role) => (
                <div key={role._id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`role-edit-${role._id}`}
                    checked={selectedRoles.includes(role._id)}
                    onChange={() => handleRoleToggle(role._id)}
                    className="mr-2"
                    disabled={loading}
                  />
                  <label htmlFor={`role-edit-${role._id}`}>
                    {role.name}
                  </label>
                </div>
              ))
            )}
          </div>
          <button
            onClick={handleUpdateRoles}
            disabled={loading}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {loading ? 'Updating...' : 'Update Roles'}
          </button>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Update Password</h3>
          {passwordUpdateMode ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleUpdatePassword}
                  disabled={loading || !newPassword || newPassword !== confirmPassword}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  onClick={() => {
                    setPasswordUpdateMode(false);
                    setNewPassword("");
                    setConfirmPassword("");
                    setError(null);
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setPasswordUpdateMode(true)}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Change Password
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserEditor;
