

import config from "../config";

const baseURL = config.baseURL;
const endpoints = config.endpoints.users;

export const getAllUsers = async () => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    const res = await fetch(`${baseURL}${endpoints.list}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      credentials: 'include'
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("getAllUsers error:", error);
    throw error;
  }
};

export const createUser = async ({ username, password, roles }) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    const res = await fetch(`${baseURL}${endpoints.create}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        'Authorization': token ? `Bearer ${token}` : ''
      },
      credentials: 'include',
      body: JSON.stringify({ username, password, roles }),
    });
    if (!res.ok) {
      throw new Error(`Failed to create user: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("createUser error:", error);
    throw error;
  }
};

export const getMe = async () => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    const res = await fetch(`${baseURL}${endpoints.me}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(
        `Failed to fetch current user: ${res.status} ${res.statusText}`
      );
    }
    return await res.json();
  } catch (error) {
    console.error("getMe error:", error);
    throw error;
  }
};

export const updateUserRoles = async ({ username, roles }) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    console.log(`Attempting to update roles for user: ${username}`);
    
    // Use direct URL construction to avoid path issues
    const res = await fetch(`${baseURL}users/roles`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        'Authorization': token ? `Bearer ${token}` : ''
      },
      credentials: 'include',
      body: JSON.stringify({ username, roles }),
    });
    if (!res.ok) {
      throw new Error(
        `Failed to update user roles: ${res.status} ${res.statusText}`
      );
    }
    return await res.json();
  } catch (error) {
    console.error("updateUserRoles error:", error);
    throw error;
  }
};

export const updatePassword = async ({ username, password }) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    console.log(`Attempting to update password for user: ${username}`);
    

    const res = await fetch(`${baseURL}users/password`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        'Authorization': token ? `Bearer ${token}` : ''
      },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      throw new Error(
        `Failed to update password: ${res.status} ${res.statusText}`
      );
    }
    return await res.json();
  } catch (error) {
    console.error("updatePassword error:", error);
    throw error;
  }
};

export const deleteUser = async (username) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    console.log(`Attempting to delete user: ${username}`);
    

    const res = await fetch(`${baseURL}users/${encodeURIComponent(username)}`, {
      method: "DELETE",
      headers: { 
        'Authorization': token ? `Bearer ${token}` : ''
      },
      credentials: 'include'
     
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to delete user: ${res.status} ${res.statusText}`
      );
    }
    
    console.log(`User deleted successfully: ${username}`);
    return await res.json();
  } catch (error) {
    console.error("deleteUser error:", error);
    throw error;
  }
};
