// services/roleService.js

import config from "../config";
const baseUrl = config.baseURL; // matches your `baseURL` key

/**
 * GET /roles
 */
export const getAllRoles = async () => {
  try {
    const res = await fetch(`${baseUrl}${config.endpoints.roles.list}`);
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
    const res = await fetch(
      `${baseUrl}${config.endpoints.roles.list}`, // POST to the same “list” path
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
export const deleteRole = async (id) => {
  try {
    const res = await fetch(
      `${baseUrl}${config.endpoints.roles.delete(id)}`, // builds “roles/:id”
      { method: "DELETE" }
    );
    if (!res.ok) {
      throw new Error(`Failed to delete role: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("deleteRole error:", error);
    throw error;
  }
};
