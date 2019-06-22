import Exception from './Exception';

export default class ControllerNotFoundException extends Exception {
  constructor(name) {
    super();

    this.message = 'Controller not found: ' + name;
    this.code = 40412;
  }
}