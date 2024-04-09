export const APP_URL = {
  home: "/",
  cart: "/cart",
  products: "/products",
  signUp: "/sign-up",
  login: "/login",
  myProfile: "/my-profile",
  myOrders: "/my-orders",
  checkout:'/checkout',
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
} as const;

export const APP_PARAMS = {
    // TODO: adjust consistency
  token: "token=",
  toEmail: "toEmail=",
  currentQuantityOption: "currentQuantityOption",
} as const;
