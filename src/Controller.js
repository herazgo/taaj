import React from 'react';
import each from 'lodash/each';
import Component from './Component';
import Request from './Services/Request';
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

    this.queues = [];
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

    // Importing view
    const View = this.importView(viewName);

    // View react object
    // spreading all connected props and dispatches to the view
    // so all those can be used like in controller,
    // sending the current controller as a prop,
    // sending data as a prop.
    return <View {...this.props} controller={this} data={data} />;
  }

  /**
   * Create request with ability to manipulate browser history
   */
  createRequest() {
    // Extract match and location
    var { match, location } = this.props

    // Map all requested queries into Request service
    Request.fill(match, location);

    this.request = Request;

    // Bind app history to request service.
    this.request.setHistory(this.props.history);
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
   * Renders the controller
   * OVERRIDING MAY CAUSE SERIOUS MALFUNCTIONING!
   */
  render() {
    var View = null;

    // Call the selected action method
    // specified in the route config
    if (this.props.method && this[this.props.method])
      View = this[this.props.method].bind(this).call();
    else
      throw 'Invalid controller method: ' + this.props.method;

    // Importing selected layout as a view
    const Layout = this.importView(this.layout);

    // spreading all connected props and dispatches to the layout
    // so all those can be used like in controller,
    // sending the current controller as a prop,
    // sending returned view (by action method) as a prop.
    return <Layout {...this.props} controller={this} view={View} />;
  }
}