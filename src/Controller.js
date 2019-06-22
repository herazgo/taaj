import React from 'react';
import Component from './Component';
import Router from './Services/Router';
import API from './Services/API';
import Request from './Services/Request';
// import Validation from './Services/Validation/Validation';
import each from 'lodash/each';
import map from 'lodash/map';

import ViewNotFound from './Exceptions/ViewNotFound';

export default class Controller extends Component {

  // Default layout
  // Each controller can have it's own layout
  // by setting this porperty to the specific view name.
  layout = 'App';

  // List of queued operations
  // all operations passes to a view are queued and automatically dispatched
  // after that view did mount.
  queues = [];

  // Request service provider
  // will be initialed after controller did mount
  request = null;

  /**
   * OVERRIDING MAY CAUSE SERIOUS MALFUNCTIONING!
   */
  componentDidMount() {
    // Initial request service
    this.createRequest()

    // Changing states on the fly can cuase inifinit loops in react lifecycle.
    // so all operations are queued and dispatched after
    // that the view mounted completely. This avoid loops.
    this.dispatchQueues();

    // If any concurrent request is queued, 
    // send all of them simultaneously
    this.sendConcurrentRequests();
  }

  /**
   * Imports a view
   * @param {String} viewName required
   * @returns A view
   * @throws ViewNotFound
   */
  importView(viewName) {
    try {
      // Requiring a view from `src/Views` folder
      // translates `dots` to `slashes`, so "Users.List" imports `src/Views/Users/List.jsx`
      return __non_webpack_require__(`${process.env.REACT_APP_PATH}/src/Views/` + viewName.toString().replace(/\./g, '/')).default;
    } catch (err) {
      if (err.toString().indexOf('Cannot find module') >= 0)
        throw new ViewNotFound(viewName);
      else
        throw err;
    }
  }

  /**
   * Import a view into the selected Layout
   * @param {String} viewName required
   * @param {Object} data optional
   * @param {Array} queues optional
   * @returns {React} a view
   */
  view(viewName, queues = [], data = {}) {
    // First queue all operations to dispatch later
    this.queue(queues);


    if (typeof this.pageActions === 'object') {
      this.pageActions = map(this.pageActions, (pageAction, i) => {
        return {
          label: 'عملیات ' + i,
          action: () => { },
          ...pageAction
        };
      })

      this.queue([
        this.props.setPageActions.bind(this, this.pageActions)
      ]);
    }

    // Importing view
    const View = this.importView(viewName);

    // View react object
    // spreading all connected props and dispatches to the view
    // so all those can be used like in controller,
    // sending the current controller as a prop,
    // sending data as a prop.
    return <View {...this.props} controller={this} data={data} />;
  }

  sendConcurrentRequests() {
    if (this.concurrentRequests && this.concurrentRequests.length) {
      this.props.openDialog({ type: 'preloader' });

      var requests = [];

      this.concurrentRequests.forEach(cr => {
        requests.push(cr.request());
      });

      API.all(requests).then(API.spread(function () {
        this.concurrentRequests.forEach((cr, i) => {
          cr.callback(arguments[i]);
        });

        this.props.closeDialog();
      }.bind(this)));
    }
  }

  /**
   * Create request with ability to manipulate browser history
   */
  createRequest(){
    // Extract match and location
    var { match, location } = this.props

    // Map all requested queries into Request service
    Request.fill(match, location);

    this.request = Request;

    // Bind app history to request service.
    this.request.setHistory(this.props.history);
  }

  /**
   * A shorthand to this.ajax.get(url)
   * @param {String} url 
   */
  fetch(url, then = () => { }, params) {
    if (!this.concurrentRequests)
      this.concurrentRequests = [];

    this.concurrentRequests.push({
      request: () => { return API.get(url, { params }) },
      callback: then
    })
  }

  /**
   * Queues operations to dispatch after the contoller mounted
   * @param {Array} operations 
   */
  queue(operations = []) {
    each(operations, operation => {
      if (typeof operation === 'function')
        this.queues.push(operation);
    })
  }

  /**
   * Dispatchs all queued operations
   */
  dispatchQueues() {
    each(this.queues, operation => operation.bind(this).call());
  }

  /**
   * Just to avoid importing Router in controllers 
   * for a simple redirect
   * @param {String} to 
   */
  redirect(to) {
    Router.redirect(to);
  }

  /**
   * Just to avoid importing Router in controllers 
   * for a simple reload
   * @param {String} to 
   */
  reload() {
    Router.reload();
  }

  // /**
  //  * Validates request based on rules
  //  * @param {Object} rules 
  //  * @param {Object} request 
  //  */
  // validate(rules, request){
  //     // Create a Validator of rules and request
  //     let validation = new Validation(request, rules);

  //     // Check if request matched rules
  //     let passed = validation.passes();

  //     if(!passed)
  //         // If validations not matched, set validator in app reducer.
  //         // So controller.hasError() returns true.
  //         this.props.setValidation(validation);
  //     else
  //         this.props.setValidation(null);

  //     return passed;
  // }

  // /**
  //  * Checks if validations has failed and any error exists
  //  */
  // hasError(){
  //     const {validation} = this.props;

  //     // If validation is not null
  //     if(validation)
  //         // Check if length of errors is greater than zero
  //         return Object.keys(validation.errors()).length > 0;

  //     return false;
  // }

  // /**
  //  * Returns all erros generated by validation
  //  */
  // errors(){
  //     const {validation} = this.props;

  //     // If validation is not null
  //     if(validation)
  //         return validation.errors();

  //     return [];
  // }

  /**
   * A shorthand for iterating errors
   * @param {Function} mapper 
   */
  eachError(mapper = () => { }) {
    return map(this.errors(), mapper);
  }

  /**
   * Renders the controller
   * OVERRIDING MAY CAUSE SERIOUS MALFUNCTIONING!
   */
  render() {
    // Importing selected layout as a view
    const Layout = this.importView(this.layout);

    var View = null;

    // Call the selected action method
    // specified in the route config
    if (this.props.method && this[this.props.method])
      View = this[this.props.method].bind(this).call();
    else
      throw 'Invalid controller method: ' + this.props.method;

    // spreading all connected props and dispatches to the layout
    // so all those can be used like in controller,
    // sending the current controller as a prop,
    // sending returned view (by action method) as a prop.
    return <Layout {...this.props} controller={this} view={View} />;
  }
}