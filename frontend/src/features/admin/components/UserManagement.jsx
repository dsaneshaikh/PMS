import { useState, useEffect } from "react";
import { getAllUsers, createUser, deleteUser } from "../../../../services/user";
import { getAllRoles } from "../../../../services/roles";
import UserEditor from "./UserEditor";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    selectedRoles: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      setUsers(response);
      setError(null);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await getAllRoles();
      setRoles(response);
    } catch (err) {
      console.error("Failed to load roles:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleToggle = (roleId) => {
    setFormData(prev => {
      const selectedRoles = [...prev.selectedRoles];
      if (selectedRoles.includes(roleId)) {
        return { ...prev, selectedRoles: selectedRoles.filter(id => id !== roleId) };
      } else {
        return { ...prev, selectedRoles: [...selectedRoles, roleId] };
      }
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password.trim() || formData.selectedRoles.length === 0) return;

    setLoading(true);
    try {
      await createUser({
        username: formData.username,
        password: formData.password,
        roles: formData.selectedRoles
      });
      setFormData({ username: "", password: "", selectedRoles: [] });
      fetchUsers();
      setError(null);
    } catch (err) {
      setError("Failed to create user");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (username) => {
    if (!window.confirm(`Are you sure you want to delete user ${username}?`)) return;
    
    setLoading(true);
    try {
      await deleteUser(username);
      fetchUsers();
      setError(null);
    } catch (err) {
      setError("Failed to delete user");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">User Management</h2>

      {error && (
        <div className="mb-4 bg-red-100 p-3 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleCreateUser} className="mb-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Roles
          </label>
          <div className="max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-md">
            {roles.length === 0 ? (
              <p className="text-gray-500">No roles available</p>
            ) : (
              roles.map((role) => (
                <div key={role._id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`role-${role._id}`}
                    checked={formData.selectedRoles.includes(role._id)}
                    onChange={() => handleRoleToggle(role._id)}
                    className="mr-2"
                    disabled={loading}
                  />
                  <label htmlFor={`role-${role._id}`}>
                    {role.name}
                  </label>
                </div>
              ))
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !formData.username.trim() || !formData.password.trim() || formData.selectedRoles.length === 0}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          Create User
        </button>
      </form>

      {loading && <p className="text-gray-500">Loading...</p>}

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Existing Users</h3>
        {users.length === 0 ? (
          <p className="text-gray-500">No users found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.username}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles && user.roles.map(role => (
                          <span 
                            key={role._id} 
                            className="inline-block bg-gray-100 px-2 py-1 rounded text-xs"
                          >
                            {role.name}
                          </span>
                        ))}
                        {(!user.roles || user.roles.length === 0) && (
                          <span className="text-gray-500">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="text-blue-600 hover:text-blue-800"
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.username)}
                          className="text-red-600 hover:text-red-800"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Editor Modal */}
      {editingUser && (
        <UserEditor
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUserUpdated={() => {
            setEditingUser(null);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}

export default UserManagement;
