import { Controller, Auth } from 'taaj';

export default class AuthController extends Controller {
  static reducers = ['login'];

  constructor() {
    // No need to pass props
    // this is a redux controller
    super();

    this.layout = 'App';

    this.doLogin = this.doLogin.bind(this);
  }

  doLogout(){
    Auth.logout();
    this.request.go('auth.login')
  }

  doLogin(){
    const { username, password, setError } = this.props.login;
    
    if(username === 'test' && password === 'test'){
      Auth.pretend({ name: 'Test user' })
        .then(user => this.request.go('profile'));
    } else
      setError('Invalid username or password')
  }

  viewLogin() {
    return this.view('Auth.Login');
  }
}