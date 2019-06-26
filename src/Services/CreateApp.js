import React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { withRouter, BrowserRouter } from 'react-router-dom';
import each from 'lodash/each';
import DispatchMiddleware from "./DispatchMiddleware";
import Router from './Router';
import History from './History';
import App from '../App';
import ReducerNotFound from '../Exceptions/ReducerNotFound';
import RouteFileNotFound from '../Exceptions/RouteFileNotFound';

const createApp = function (options) {
  return new Promise(resolve => {
    try {
      // const routes = __non_webpack_require__(`${process.env.REACT_APP_PATH}/src/${options.routesFile}`).default
      // const routes = __non_webpack_require__(`${process.env.REACT_APP_PATH}/src/routes.js`).default
      options.routes.forEach(r => Router.add(r));

      // Import root reducer of app.
      options.reducers = {
        root: require('../rootReducer.js'),
        ...options.reducers
      }

      // const AppReducer = __non_webpack_require__(`${process.env.REACT_APP_PATH}/src/${options.appReducer}`);
      // const AppReducer = __non_webpack_require__(`${process.env.REACT_APP_PATH}/src/Reducers/App.js`);
      // All imported redux components
      var allRedux = {};

      // All reducers to be combined
      var allReducers = {};

      each(options.reducers, (rdx, name) => {
        try {
          allRedux[name] = rdx;

          // Sperately push reducer to be combined
          allReducers[name] = rdx.default;
        } catch (err) {
          if (err.toString().indexOf('Cannot find module') >= 0) {
            throw new ReducerNotFound(reducerName);
          }

          throw err;
        }
      })
      
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

      // Create a redux store using root reducer
      const store = createStore(combineReducers(allReducers), applyMiddleware(DispatchMiddleware));

      // Connect the app to the root store, integrated with react-router-dom
      const ConnectedApp = withRouter(connect(
        mapper,
        mapper,
        mergeProps
      )(App))

      resolve(() => (
        <Provider store={store}>
          <BrowserRouter history={History}>
            <ConnectedApp />
          </BrowserRouter>
        </Provider>
      ))
    } catch (error) {
      const errorText = error.toString();

      // If error is about not finding a Taaj module
      if (errorText.indexOf('Cannot find module') >= 0) {
        [
          // routes file
          { pattern: options.routesFile, exception: RouteFileNotFound },
          // app reducer file
          { pattern: options.appReducer, exception: ReducerNotFound },
        ].forEach(missingModule => {
          if ((new RegExp(missingModule.pattern)).test(errorText))
            throw new missingModule.exception(`\`${missingModule.pattern}\``);
        })
      }

      // throw any other unknown exceptions 
      // to handled by client application
      throw error;
    }
  })
}

export default createApp;