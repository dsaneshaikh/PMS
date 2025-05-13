import { useState, useEffect } from "react";
import { getAllRoles, createRole, deleteRole } from "../../../../services/roles";
import { getAllPermissions } from "../../../../services/permissions";
import RoleEditor from "./RoleEditor";

function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [newRoleName, setNewRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingRole, setEditingRole] = useState(null);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await getAllRoles();
      setRoles(response);
      setError(null);
    } catch (err) {
      setError("Failed to load roles");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await getAllPermissions();
      setPermissions(response);
    } catch (err) {
      console.error("Failed to load permissions:", err);
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!newRoleName.trim() || selectedPermissions.length === 0) return;

    setLoading(true);
    try {
      await createRole(newRoleName, selectedPermissions);
      setNewRoleName("");
      setSelectedPermissions([]);
      fetchRoles();
      setError(null);
    } catch (err) {
      setError("Failed to create role");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (id) => {
    setLoading(true);
    try {
      await deleteRole(id);
      fetchRoles();
      setError(null);
    } catch (err) {
      setError("Failed to delete role");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (permissionId) => {
    setSelectedPermissions(prevSelected => {
      if (prevSelected.includes(permissionId)) {
        return prevSelected.filter(id => id !== permissionId);
      } else {
        return [...prevSelected, permissionId];
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Role Management</h2>

      {error && (
        <div className="mb-4 bg-red-100 p-3 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleCreateRole} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role Name
          </label>
          <input
            type="text"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="Enter role name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Permissions
          </label>
          <div className="max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-md">
            {permissions.length === 0 ? (
              <p className="text-gray-500">No permissions available</p>
            ) : (
              permissions.map((permission) => (
                <div key={permission._id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`permission-${permission._id}`}
                    checked={selectedPermissions.includes(permission._id)}
                    onChange={() => handlePermissionToggle(permission._id)}
                    className="mr-2"
                    disabled={loading}
                  />
                  <label htmlFor={`permission-${permission._id}`}>
                    {permission.name}
                  </label>
                </div>
              ))
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !newRoleName.trim() || selectedPermissions.length === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          Create Role
        </button>
      </form>

      {loading && <p className="text-gray-500">Loading...</p>}

      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Existing Roles</h3>
        {roles.length === 0 ? (
          <p className="text-gray-500">No roles found</p>
        ) : (
          <ul className="border rounded-md divide-y">
            {roles.map((role) => (
              <li key={role._id} className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{role.name}</span>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setEditingRole(role)}
                      className="text-blue-600 hover:text-blue-800"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRole(role._id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="mb-1">Permissions:</p>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions && role.permissions.map(perm => (
                      <span 
                        key={perm._id} 
                        className="inline-block bg-gray-100 px-2 py-1 rounded text-xs"
                      >
                        {perm.name}
                      </span>
                    ))}
                    {(!role.permissions || role.permissions.length === 0) && (
                      <span className="text-gray-500">None</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Role Editor Modal */}
      {editingRole && (
        <RoleEditor
          role={editingRole}
          onClose={() => setEditingRole(null)}
          onRoleUpdated={() => {
            setEditingRole(null);
            fetchRoles();
          }}
        />
      )}
    </div>
  );
}

export default RoleManagement;
