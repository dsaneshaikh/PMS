const config = {
  baseURL: import.meta.env.VITE_BASE_URL,
  endpoints: {
    auth: {
      login: import.meta.env.VITE_AUTH_LOGIN,
      logout: import.meta.env.VITE_AUTH_LOGOUT,
      refresh: import.meta.env.VITE_AUTH_REFRESH,
    },
    permissions: {
      list: import.meta.env.VITE_PERMISSIONS_LIST,
      // usage: config.endpoints.permissions.delete(id)
      delete: (id) =>
        import.meta.env.VITE_PERMISSIONS_DELETE.replace(":id", id),
    },
    roles: {
      list: import.meta.env.VITE_ROLES_LIST,
      // usage: config.endpoints.roles.delete(id)
      delete: (id) => import.meta.env.VITE_ROLES_DELETE.replace(":id", id),
    },
    users: {
      list: import.meta.env.VITE_USERS_LIST,
      create: import.meta.env.VITE_USERS_CREATE,
      me: import.meta.env.VITE_USERS_ME,
      updateRoles: import.meta.env.VITE_USERS_UPDATE_ROLES,
      updatePassword: import.meta.env.VITE_USERS_UPDATE_PASSWORD,
      // if your delete route is parameterized you can wrap it similarly;
      // here it’s a fixed string, so just use it directly:
      delete: import.meta.env.VITE_USERS_DELETE,
    },
  },
};

export default config;
