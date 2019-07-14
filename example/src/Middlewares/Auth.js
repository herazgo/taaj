import React from 'react';
import { Auth, Redirect } from 'taaj';

export default () => {
    // If a route is private and user is not autheticated
    // then redirect to login page.
    if(!Auth.check())
      return <Redirect to="auth.login" />
}