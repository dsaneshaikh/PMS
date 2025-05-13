// services/roleService.js

import config from "../config";
const baseURL = config.baseURL; // matches your `baseURL` key

/**
 * GET /roles
 */
export const getAllRoles = async () => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    const res = await fetch(`${baseURL}${config.endpoints.roles.list}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      credentials: 'include'
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch roles: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("getAllRoles error:", error);
    throw error;
  }
};

/**
 * POST /roles
 * @param {string} name
 * @param {Array<string>} permissions  // array of permission IDs
 */
export const createRole = async (name, permissions = []) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    const res = await fetch(
      `${baseURL}${config.endpoints.roles.list}`, // POST to the same “list” path
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': token ? `Bearer ${token}` : ''
        },
        credentials: 'include',
        body: JSON.stringify({ name, permissions }),
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to create role: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("createRole error:", error);
    throw error;
  }
};

/**
 * DELETE /roles/:id
 * @param {string} id
 */
/**
 * Update the permissions of a role
 * @param {string} id - The role ID
 * @param {Array<string>} permissions - Array of permission IDs
 */
export const updateRolePermissions = async (id, permissions = []) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    console.log(`Attempting to update permissions for role ID: ${id}`);
    
    const res = await fetch(
      `${baseURL}roles/${id}/permissions`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': token ? `Bearer ${token}` : ''
        },
        credentials: 'include',
        body: JSON.stringify({ permissions })
      }
    );
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Server response:', errorData);
      throw new Error(
        errorData.message || `Failed to update role permissions: ${res.status} ${res.statusText}`
      );
    }
    
    console.log(`Role permissions updated successfully for ID: ${id}`);
    return await res.json();
  } catch (error) {
    console.error("updateRolePermissions error:", error);
    throw error;
  }
};

export const deleteRole = async (id) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    console.log(`Attempting to delete role with ID: ${id}`);
    
    // Use direct URL construction instead of relying on the config's string replacement
    // This ensures we don't have double slashes or other URL formatting issues
    const res = await fetch(
      `${baseURL}roles/${id}`,
      { 
        method: "DELETE",
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        credentials: 'include'
      }
    );
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Server response:', errorData);
      throw new Error(
        errorData.message || `Failed to delete role: ${res.status} ${res.statusText}`
      );
    }
    
    console.log(`Role deleted successfully with ID: ${id}`);
    return await res.json();
  } catch (error) {
    console.error("deleteRole error:", error);
    throw error;
  }
};
