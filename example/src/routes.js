export default [
  {
    path: "/login",
    controller: 'Auth@viewLogin',
    name: "auth.login",
  },

  {
    path: "/",
    controller: 'App@index',
    name: "home",
  },

  {
    path: "/user-profile",
    controller: 'App@profile',
    name: "profile",
    middleware: "Auth",
  }
]
