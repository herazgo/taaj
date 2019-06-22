import Exception from './Exception';

export default class RouteFileNotFound extends Exception {
  constructor(name) {
    super();

    this.message = 'Routes file not found: ' + name;
    this.code = 40410;
  }
}