import { useState, useEffect } from "react";
import { getAllPermissions } from "../../../../services/permissions";
import { updateRolePermissions } from "../../../../services/roles";

function RoleEditor({ role, onClose, onRoleUpdated }) {
  const [allPermissions, setAllPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Load all available permissions
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const permissionsData = await getAllPermissions();
        setAllPermissions(permissionsData);
        
        // Initialize selected permissions based on role's current permissions
        if (role && role.permissions) {
          setSelectedPermissions(
            role.permissions.map(permission => permission._id || permission.id)
          );
        }
      } catch (err) {
        console.error("Failed to load permissions:", err);
        setError("Failed to load permissions");
      }
    };
    
    fetchPermissions();
  }, [role]);

  const handlePermissionToggle = (permissionId) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  const handleUpdatePermissions = async () => {
    if (!role || !role._id) return;
    
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      await updateRolePermissions(role._id, selectedPermissions);
      setSuccessMessage("Role permissions updated successfully");
      if (onRoleUpdated) onRoleUpdated();
    } catch (err) {
      console.error("Failed to update permissions:", err);
      setError(err.message || "Failed to update role permissions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Role: {role?.name}</h2>
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
          <h3 className="text-lg font-medium mb-2">Update Permissions</h3>
          <div className="max-h-60 overflow-y-auto p-3 border border-gray-300 rounded-md">
            {allPermissions.length === 0 ? (
              <p className="text-gray-500">No permissions available</p>
            ) : (
              allPermissions.map((permission) => (
                <div key={permission._id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`permission-edit-${permission._id}`}
                    checked={selectedPermissions.includes(permission._id)}
                    onChange={() => handlePermissionToggle(permission._id)}
                    className="mr-2"
                    disabled={loading}
                  />
                  <label htmlFor={`permission-edit-${permission._id}`} className="text-gray-800">
                    {permission.name}
                  </label>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdatePermissions}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {loading ? 'Updating...' : 'Update Permissions'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleEditor;
