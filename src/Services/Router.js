/* eslint-disable */
import omit from 'lodash/omit';
import each from 'lodash/each';

class RouterService {
  constructor() {
    this.routes = {};
  }

  get length() {
    return Object.keys(this.routes).length;
  }

  map(callback) {
    callback = callback.bind(this);

    return Object.keys(this.routes).map(function (n) {
      return callback(this.routes[n], n);
    }.bind(this))
  }

  add(route, parent) {
    let key = 'route-' + this.length;

    let newRoute = Object.assign({
      name: key,
      path: "/",
      private: false,
      controller: null,
      store: null,
      middleware: [],
    }, omit(route, ['routes']), {
      key: key
    });

    if (typeof newRoute.middleware === 'string')
      newRoute.middleware = [newRoute.middleware];

    if (parent) {
      if (parent.private)
        newRoute.private = parent.private;

      newRoute.middleware = [
        ...parent.middleware,
        ...newRoute.middleware
      ];
    }

    this.routes[newRoute.name] = newRoute;

    if (typeof route.routes == 'object')
      route.routes.forEach(r => this.add(r, newRoute));
  }

  find(name) {
    if (typeof this.routes[name] !== 'undefined')
      return this.routes[name];

    throw 'Route does not exists: ' + name;
  }

  exists(name){
    return this.routes[name] !== undefined;
  }

  to(name, data = {}) {
    var path = this.find(name).path;

    each(data, (value, key) => {
      let rx = new RegExp(":" + key, "g");
      path = path.replace(rx, value);
    })

    return path;
  }
}

const Router = new RouterService()

export default Router;