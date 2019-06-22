import React from 'react'
import { Link } from 'taaj';

export default (props) => (
  <React.Fragment>
    <p>This is a public page</p>
    <p>
      <Link to="profile">Go to profile page (private)</Link> | <Link to="auth.login">Login</Link>
    </p>
  </React.Fragment>
)
