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
    /**
     * This is the path of your route
     */  
    path: "/user-profile",
     /* 
    * This property contain two name the first is your Controller name
    * and the second one is your method name in the controller
    * for this page and youcould seperate them with `@` 
    */
    controller: 'App@profile',
    /**
     * you could set name for each of your route in application
     * and use this name in your Route object for better access
     * you 
     * and you can seperate them with `.` or `/` 
     */
    name: "profile",
    /**
     * You can set the Middleware for your each routes
     */
    middleware: "Auth",
  }
]
