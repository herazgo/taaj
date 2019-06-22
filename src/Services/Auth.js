import Storage from './Storage';
import API from './API';

const localToken = '__TAAJ_AUTH_TOKEN__';

class AuthService {
  constructor(){
    this.user = Storage.getItem(localToken);
  }
  
  login(authUrl, data) {
    return new Promise((resolve, reject) => {
      // Send an request to API to authenticate user via given id and password
      API.post(authUrl, data).then(response => {
        // Request responded with a success status in the range of 2xx
        // so assign the responded information as current user
        this.user = response.data;

        // Save user information in local storage
        Storage.setItem(localToken, this.user);
  
        API.header('X-API-TOKEN', this.user.token);
  
        // Resolve callback with user information
        resolve(this.user);
      }).catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          reject(error.response.status);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          callback(error.response.status);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Unexpected Auth Error: ' + error.message);
        }
      });
    })
  }

  logout() {
    Storage.removeItem(localToken);
  }

  pretend(user){
    return new Promise(resolve => {
      this.user = user;
      Storage.setItem(localToken, this.user);

      resolve(this.user);
    })
  }

  check() {
    this.user = Storage.getItem(localToken);

    if (!this.user) return false;

    return true;
  }
}

const Auth = new AuthService();

export default Auth;