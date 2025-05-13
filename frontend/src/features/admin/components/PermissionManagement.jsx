import { useState, useEffect } from "react";
import { getAllPermissions, createPermission, deletePermission } from "../../../../services/permissions";

function PermissionManagement() {
  const [permissions, setPermissions] = useState([]);
  const [newPermission, setNewPermission] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const response = await getAllPermissions();
      setPermissions(response);
      setError(null);
    } catch (err) {
      setError("Failed to load permissions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePermission = async (e) => {
    e.preventDefault();
    if (!newPermission.trim()) return;

    setLoading(true);
    try {
      await createPermission(newPermission);
      setNewPermission("");
      fetchPermissions();
    } catch (err) {
      setError("Failed to create permission");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePermission = async (id) => {
    setLoading(true);
    try {
      await deletePermission(id);
      fetchPermissions();
    } catch (err) {
      setError("Failed to delete permission");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Permission Management</h2>

      {error && (
        <div className="mb-4 bg-red-100 p-3 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleCreatePermission} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newPermission}
            onChange={(e) => setNewPermission(e.target.value)}
            placeholder="New permission name"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newPermission.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            Create
          </button>
        </div>
      </form>

      {loading && <p className="text-gray-500">Loading...</p>}

      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Existing Permissions</h3>
        {permissions.length === 0 ? (
          <p className="text-gray-500">No permissions found</p>
        ) : (
          <ul className="border rounded-md divide-y">
            {permissions.map((permission) => (
              <li key={permission._id} className="flex items-center justify-between p-3">
                <span>{permission.name}</span>
                <button
                  onClick={() => handleDeletePermission(permission._id)}
                  className="text-red-600 hover:text-red-800"
                  disabled={loading}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PermissionManagement;
