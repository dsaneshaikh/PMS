import config from "../config";
const baseURL = config.baseURL;

export const login = async (username, password) => {
  const url = `${baseURL}${config.endpoints.auth.login}`;
  const options = {
    method: "POST",
    credentials: "include",           
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  };

  try {
    const res = await fetch(url, options);


    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Login failed: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("login error:", error);
    return { success: false, message: error.message || 'Network error. Please try again later.' };
  }
};

export const logout = async () => {
  const url = `${baseURL}${config.endpoints.auth.logout}`;
  const options = {
    method: "POST",
    credentials: "include",           
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Logout failed: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("logout error:", error);
    return { success: false, message: error.message || 'Network error. Please try again later.' };
  }
};
