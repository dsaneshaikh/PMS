const config = {
  baseURL: import.meta.env.VITE_BASE_URL,  // e.g. "http://localhost:5000/api/"

  endpoints: {
    auth: {
      login: import.meta.env.VITE_AUTH_LOGIN,       // "auth/login"
      logout: import.meta.env.VITE_AUTH_LOGOUT,     // "auth/logout"
      refresh: import.meta.env.VITE_AUTH_REFRESH    // "auth/refresh"
    },
    permissions: {
      list: import.meta.env.VITE_PERMISSIONS_LIST,  // "permissions"
      delete: (id) =>
        import.meta.env.VITE_PERMISSIONS_DELETE.replace(':id', id)  // "permissions/:id"
    },
    roles: {
      list: import.meta.env.VITE_ROLES_LIST,        // "roles"
      delete: (id) =>
        import.meta.env.VITE_ROLES_DELETE.replace(':id', id)        // "roles/:id"
    },
    users: {
      list: import.meta.env.VITE_USERS_LIST,        // "users"
      create: import.meta.env.VITE_USERS_CREATE,    // "users/createUser"
      me: import.meta.env.VITE_USERS_ME,            // "users/me"
      updateRoles: import.meta.env.VITE_USERS_UPDATE_ROLES,       // "users/updateUserRoles"
      updatePassword: import.meta.env.VITE_USERS_UPDATE_PASSWORD, // "users/updatePassword"
      delete: import.meta.env.VITE_USERS_DELETE     // "users/deleteUser"
    }
  }
};

export default config;
