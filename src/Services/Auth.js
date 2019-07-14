import Storage from './Storage';
import API from './API';

const localToken = '__TAAJ_AUTH_TOKEN__';

class AuthService {
  constructor(){
    this.authUser = Storage.getItem(localToken);
  }

  get user(){
    return this.authUser;
  }
  
  login(authUrl, data) {
    return new Promise((resolve, reject) => {
      // Send an request to API to authenticate user via given id and password
      API.post(authUrl, data).then(response => {
        // Request responded with a success status in the range of 2xx
        // so assign the responded information as current user
        this.authUser = response.data;
        
        // Save user information in local storage
        Storage.setItem(localToken, this.authUser);
        
        API.header('X-API-TOKEN', this.authUser.token);
        
        // Resolve callback with user information
        resolve(this.authUser);
      }).catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          reject(error.response.status);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          reject(error.response.status);
        } else {
          // Something happened in setting up the request that triggered an Error
          reject(500);
        }
      });
    })
  }

  logout() {
    Storage.removeItem(localToken);
  }

  pretend(user){
    return new Promise(resolve => {
      this.authUser = user;
      Storage.setItem(localToken, this.authUser);

      resolve(this.authUser);
    })
  }

  check() {
    this.authUser = Storage.getItem(localToken);

    if (!this.authUser) return false;

    return true;
  }
}

const Auth = new AuthService();

export default Auth;