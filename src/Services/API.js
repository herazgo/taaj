import axios from 'axios'
import Auth from './Auth';

class APIService {
  constructor() {
    this.ajax = axios.create({
      baseURL: process.env.REACT_APP_API_SERVER,
      timeout: 10000
    })

    if(Auth.check() && Auth.user.token)
      this.header('X-API-TOKEN', Auth.user.token);
  }

  get baseURL() {
    return this.ajax.defaults.baseURL
  }
  set baseURL(url) {
    this.ajax.defaults.baseURL += url
  }

  get interceptors() {
    return this.ajax.interceptors
  }

  header(name, value) {
    var { currentHeaders } = this.ajax.defaults
    this.ajax.defaults.headers = {
      ...currentHeaders,
      [name]: value
    }
  }

  get(path, data) {
    return this.ajax.get(path, data)
  }

  post(path, data) {
    return this.ajax.post(path, data)
  }

  patch(path, data) {
    return this.ajax.patch(path, data)
  }

  head(path, data) {
    return this.ajax.head(path, data);
  }

  delete(path, data = {}) {
    return this.ajax.post(path, {
      ...data,
      "_method": "DELETE"
    })
  }

  put(path, data = {}) {
    return this.ajax.post(path, {
      ...data,
      "_method": "PUT"
    })
  }

  all(requests) {
    return axios.all(requests)
  }

  spread(callbacks) {
    return axios.spread(callbacks)
  }
}

const API = new APIService()

export default API