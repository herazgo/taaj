# Taaj
* [Installation]()
* Usage
    * Routes
    * Controller
    * Reducers
    * View
    * Assets
* Licence

## Routes
Routes is an object can manage your application route and 
Retrive your routes with that.
In your app you have a `routes.js` file that contain list of your application routes.

```
export default [
  {
    /**
     * This is the path of your route
     */  
    path: "/",
    /* 
    * This property contain two name the first is your Controller name
    * and the second one is your method name in the controller
    * for this page and youcould seperate them with `@` 
    */
    controller: 'App@index',
    /**
     * you could set name for each of your route in application
     * and use this name in your Route object for better access
     * you 
     * and you can seperate them with `.` or `/` 
     */
    name: "home",
  },
  {
    path: "/user-profile",
    controller: 'App@profile',
    name: "profile",
    /**
     * You can set the Middleware for your each routes
     */
    middleware: "Auth",
  }
]

```
