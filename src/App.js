import React, { Component, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import each from 'lodash/each';
import Router from './Services/Router';
import ControllerNotFound from './Exceptions/ControllerNotFound';
import MiddlewareNotFound from './Exceptions/MiddlewareNotFound';
import ReducerNotFound from './Exceptions/ReducerNotFound';
import { Error404, Error401 } from './Views/Errors.jsx'

export default class App extends Component {
  constructor() {
    super();

    // The App architecture is designed to work with react-router and redux,
    // so controllers are connected to their store when a route is rendered.
    // Everytime a route is rendered a new store will be created,
    // so it will be reverted to it's default state.
    // To aviod this, the App is caching all controllers
    // the first time they are creating. So a store will be created only once
    // in the route rendering momentum.
    // All cached connected controllers are kept here for later use.
    this.controllers = {};
  }

  /**
   * Defines a callable function to create controller of type react object
   * which is connected it to it's own store.
   * @param {String} name
   * @returns {Function} function to create connected controller
   */
  createController(ControllerName, ControllerMethod) {
    // Only making a unique hash for controller
    var CryptoJS = require('crypto-js');
    var hash = CryptoJS.MD5(`${ControllerName}-${ControllerMethod}`);

    // If controller doesn't exists in the cached list
    if (typeof this.controllers[hash] === 'undefined') {
      try {
        // Requiring the controller object
        const Controller = __non_webpack_require__(`${process.env.REACT_APP_PATH}/src/Controllers/${ControllerName}.js`).default;

        // If any reducer specified in the controller
        if (Controller && Controller.reducers && Controller.reducers.length) {
          // All imported redux components
          var allRedux = {};

          // All reducers to be combined
          var allReducers = {};

          if (Controller.reducers && Controller.reducers.length) {
            Controller.reducers.forEach(reducerName => {
              try {
                // Require all redux components from `src/Reducers` folder
                // Every reducer exports a reducer as default,
                // a callable mapStateToProps and mapDispatchToProps mapper.
                // NOTE: The name of the reducer should be exactly the same
                // as statically defined in controller reducer
                allRedux[reducerName] = __non_webpack_require__(`${process.env.REACT_APP_PATH}/src/Reducers/${ControllerName}/${reducerName}.js`);

                // Sperately push reducer to be combined
                allReducers[reducerName] = allRedux[reducerName].default;
              } catch (err) {
                if (err.toString().indexOf('Cannot find module') >= 0) {
                  throw new ReducerNotFound(reducerName);
                }

                throw err;
              }
            })
          }

          // Create a mapper function.
          // It accepts `op` parameter which could be prev state or dispatcher function.
          var mapper = (op) => {
            // All mapped states and dispatches
            var mapped = {};

            each(allRedux, (rdx, name) => {
              // If mapping states
              if (typeof op === 'object') {
                // Map states grouped by reducer name
                mapped[name] = rdx.mapStateToProps(op[name]);
              } else {
                // Map dispatches grouped by reducer name
                mapped[name] = rdx.mapDispatchToProps(op);
              }
            })

            return mapped;
          }

          // Merges all mapped props
          var mergeProps = (stateProps, dispatchProps, ownProps) => {
            // All merged props, initialized by App props
            var merged = { ...ownProps };

            each(allRedux, (rdx, name) => {
              // Merge all props and dispatched
              // with the same key as reducer name.
              merged[name] = {
                ...stateProps[name],
                ...dispatchProps[name]
              };
            })

            return merged;
          }

          // Creating a store by reducer
          const store = createStore(combineReducers(allReducers));

          // Connecting controller to the store
          const ConnectedController = connect(
            mapper,
            mapper,
            mergeProps
          )(Controller);

          // Cache the connected controller creator to use it everytime
          // a related route is rendered.
          this.controllers[hash] = props => (
            <ConnectedController store={store} method={ControllerMethod} {...props} />
          );
        } else {
          // If there is no reducer available for the controller,
          // a non-redux controller will be created.
          this.controllers[hash] = props => (
            <Controller method={ControllerMethod} {...props} />
          );
        }
      } catch (err) {
        if (err.toString().indexOf('Cannot find module') >= 0) {
          throw new ControllerNotFound(ControllerName);
        }

        throw err;
      }
    }

    return this.controllers[hash];
  }

  render() {
    const { httpStatus } = this.props.root;
    
    return (
      <Switch>
        {Router.map(route => (
          <Route
            key={route.key}
            path={route.path}
            // All routes are always exactly matched
            exact={true}
            render={props => ((() => {
            switch(httpStatus){
              case 200: 
                const pipe = (middles) => {
                  return middles.slice(0).reduce((res, mw, i, allMw) => {
                    if(i < allMw.length - 1){
                      var [mwName, mwParams] = mw.split(':');
                      
                      try {
                        // Import from `src/Middlewares` folder
                        var middleware = __non_webpack_require__(`${process.env.REACT_APP_PATH}/src/Middlewares/${mwName}.js`).default;
                      } catch (err) {
                        if (err.toString().indexOf('Cannot find module') >= 0) {
                          throw new MiddlewareNotFound(mwName);
                        }
  
                        throw err;
                      }

                      const mwResult = middleware({
                        // current route
                        route: route,
                        // parameters
                        params: mwParams,
                        // abort function to set app status
                        abort: status => this.props.root.setHttpStatus(status)
                      });

                      if(mwResult){
                        allMw.splice(1);
                        return mwResult;
                      }
                    }
                      
                    return res;
                  }, Controller)
                }

                // Spliting controller name and method
                const [ControllerName, ControllerMethod] = route.controller.split('@');

                // create a controller using cached creator,
                // spreading all App and Route props to the controller.
                var Controller = this.createController(ControllerName, ControllerMethod)
                  ({ ...this.props, ...props });

                // Create a new array of middlewares.
                const Middlewares = [
                  ...route.middleware,
                  () => Controller
                ];

                return (
                  // Fragmets are virtual nodes to contain other elements
                  <Fragment>
                    {/* If navigation is blocked, a prompt message appears to confirm user. */}
                    {/* <Prompt
                      message={location => navigationMessage.replace(':pathname', location.pathname)}
                      when={navigationBlocked} /> */}

                    {pipe(Middlewares)}
                  </Fragment>
                );

            case 401: case 403:
              return <Error401 />
            }})()
          )}/>
        ))}

        <Route
          path="/reload"
          component={({ history, location, match }) => {
            history.replace({
              ...location,
              pathname: location.pathname.substring(match.path.length)
            });
            return null;
          }}
        />

        {/* Route not found */}
        <Route component={Error404} />
      </Switch>
    )
  }
}
