import config from "../config";
const baseUrl = config.baseURL;

const login = async (username, password) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  };
  try {
    const login = await fetch(
      `${baseUrl}${config.endpoints.auth.login}`,
      options
    );
    return await login.json();
  } catch (error) {
    console.log(error);
  }
};
const logout = async () => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const logout = await fetch(
      `${baseUrl}${config.endpoints.auth.logout}`,
      options
    );
    return await logout.json();
  } catch (error) {
    console.log(error);
  }
};
