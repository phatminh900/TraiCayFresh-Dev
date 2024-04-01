const BASE_API = "/api";

export const API_ROUTES = {
  me: BASE_API + "/customers/me",
  forgotPassword: BASE_API + "/customers/forgot-password",
  logOut: BASE_API + "/customers/logout",
} as const;
