import React from 'react'
import ReactDOM from 'react-dom'
import createApp from 'taaj'

import * as serviceWorker from './serviceWorker'

createApp({
  reducers: {app: require('./Reducers/App')},
  routes: require('./routes').default
}).then(App => {

  ReactDOM.render(<App />, document.getElementById('root'))

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister()
}).catch(console.log)
