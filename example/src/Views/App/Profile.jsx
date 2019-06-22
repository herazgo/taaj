import React from 'react';
import { Auth } from 'taaj';

export default (props) => (
  <React.Fragment>
    <p>User profile</p>

    Hello: {Auth.user.name}
  </React.Fragment>
)
