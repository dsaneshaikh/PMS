import config from "../config";

const baseURL = config.baseURL;

export const getAllPermissions = async () => {
  try {
    const res = await fetch(`${baseURL}${config.endpoints.permissions.list}`);
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
    const res = await fetch(`${baseURL}${config.endpoints.permissions.list}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    const res = await fetch(
      `${baseURL}${config.endpoints.permissions.delete(id)}`,
      {
        method: "DELETE",
      }
    );
    if (!res.ok) {
      throw new Error(
        `Failed to delete permission: ${res.status} ${res.statusText}`
      );
    }
    return await res.json();
  } catch (error) {
    console.error("deletePermission error:", error);
    throw error;
  }
};
