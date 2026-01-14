export default {
  node_env: import.meta.env.VITE_NODE_ENV,

  api_url:
    import.meta.env.VITE_NODE_ENV == "development"
      ? import.meta.env.VITE_BACKEND_URL_LOCAL
      : import.meta.env.VITE_BACKEND_URL_PRODUCTION,
  socket_url:
    import.meta.env.VITE_NODE_ENV == "development"
      ? import.meta.env.VITE_SOCKET_URL_DEV
      : import.meta.env.VITE_SOCKET_URL_PRODUCTION,
};
