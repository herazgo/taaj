import React from 'react'
import { Link } from 'taaj';

export default ({ controller, login }) => (
  <React.Fragment>
    <p>Login page</p>
    
    <div>
      Username: <input type="text" placeholder="test"
        onChange={e => login.setUser(e.target.value)} />
    </div>
    <div>
      Password: <input type="password" placeholder="test"
        onChange={e => login.setPass(e.target.value)} />
    </div>
    
    <div>
      <p>{login.errorMessage && <small><i>{login.errorMessage}</i></small>}</p>
      <button onClick={controller.doLogin}>Login</button>
    </div>
    <p>
      <small><Link to="home">Go to homepage</Link></small>
    </p>
  </React.Fragment>
)
