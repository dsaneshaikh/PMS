import config from "../config";

const baseURL = config.baseURL;

export const getAllPermissions = async () => {
  try {
    // Get token from localStorage or wherever your auth token is stored
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    // Make request with auth header
    const res = await fetch(`${baseURL}${config.endpoints.permissions.list}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      credentials: 'include'
    });
    
    if (!res.ok) {
      throw new Error(
        `Failed to fetch permissions: ${res.status} ${res.statusText}`
      );
    }
    return await res.json();
  } catch (error) {
    console.error("getAllPermissions error:", error);
    throw error;
  }
};

export const createPermission = async (name) => {
  try {
    // Get token from localStorage or wherever your auth token is stored
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    const res = await fetch(`${baseURL}${config.endpoints.permissions.list}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        'Authorization': token ? `Bearer ${token}` : ''
      },
      credentials: 'include',
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      throw new Error(
        `Failed to create permission: ${res.status} ${res.statusText}`
      );
    }
    return await res.json();
  } catch (error) {
    console.error("createPermission error:", error);
    throw error;
  }
};

export const deletePermission = async (id) => {
  try {
    // Get token from localStorage or wherever your auth token is stored
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    console.log(`Attempting to delete permission with ID: ${id}`);
    
    // Use direct URL construction instead of relying on the config's string replacement
    // This ensures we don't have double slashes or other URL formatting issues
    const res = await fetch(
      `${baseURL}permissions/${id}`,
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
        errorData.message || `Failed to delete permission: ${res.status} ${res.statusText}`
      );
    }
    
    console.log(`Permission deleted successfully with ID: ${id}`);
    return await res.json();
  } catch (error) {
    console.error("deletePermission error:", error);
    throw error;
  }
};
