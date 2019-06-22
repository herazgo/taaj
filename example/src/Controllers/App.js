import { Controller } from 'taaj';

export default class AppController extends Controller {
  static reducers = [];

  constructor() {
    super();

    this.layout = 'App';
  }

  index() {
    return this.view('App.Index');
  }

  profile() {
    return this.view('App.Profile');
  }
}