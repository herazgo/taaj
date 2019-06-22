import React from 'react'
import { connect, Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { withRouter, BrowserRouter } from 'react-router-dom'
import DispatchMiddleware from "./DispatchMiddleware";
import Router from './Router';
import History from './History';
import App from '../App';
import ReducerNotFound from '../Exceptions/ReducerNotFound';
import RouteFileNotFound from '../Exceptions/RouteFileNotFound';

const createApp = function (options) {
  return new Promise(resolve => {
    try {
      const routes = __non_webpack_require__(`${process.env.REACT_APP_PATH}/src/${options.routesFile}`).default
      routes.forEach(r => Router.add(r));

      // Import root reducer of app.
      const AppReducer = __non_webpack_require__(`${process.env.REACT_APP_PATH}/src/${options.rootReducer}`);

      // Create a redux store using root reducer
      const store = createStore(AppReducer.default, applyMiddleware(DispatchMiddleware));

      // Connect the app to the root store, integrated with react-router-dom
      const ConnectedApp = withRouter(connect(
        AppReducer.mapStateToProps,
        AppReducer.mapDispatchToProps
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
          // root reducer file
          { pattern: options.rootReducer, exception: ReducerNotFound },
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