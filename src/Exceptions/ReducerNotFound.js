import Exception from './Exception';

export default class ViewNotFoundException extends Exception {
  constructor(name) {
    super();

    this.message = 'Reducer not found: ' + name;
    this.code = 40411;
  }
}