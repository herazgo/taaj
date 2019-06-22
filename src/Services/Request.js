import Router from './Router';
const qs = require('query-string')

class RequestService {
  history = null;

  fill(match, location) {
    this.queries = qs.parse(location.search)

    this.params = {
      ...match.params,
      ...this.queries,
    }
  }

  get(param) {
    if (this.params[param])
      return this.params[param]

    return null
  }

  query(param) {
    if (this.queries[param])
      return this.queries[param]

    return null
  }

  setHistory(history){
    this.history = history;
  }

  is(name) {
    const { pathname } = this.history.location;
    return pathname == Router.to(name);
  }

  go(to){
    const toUrl = Router.exists(to) ?
      Router.to(to) : to;

    this.history.push(toUrl)
  }
}

const Request = new RequestService()

export default Request
