// src/services/userService.js

import config from "../config";

const baseURL = config.baseURL;
const endpoints = config.endpoints.users;

export const getAllUsers = async () => {
  try {
    const res = await fetch(`${baseURL}${endpoints.list}`);
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
    const res = await fetch(`${baseURL}${endpoints.create}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    const res = await fetch(`${baseURL}${endpoints.me}`, {
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
    const res = await fetch(`${baseURL}${endpoints.updateRoles}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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
    const res = await fetch(`${baseURL}${endpoints.updatePassword}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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
    const res = await fetch(`${baseURL}${endpoints.delete}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    if (!res.ok) {
      throw new Error(`Failed to delete user: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("deleteUser error:", error);
    throw error;
  }
};
