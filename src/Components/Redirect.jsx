import React from 'react';
import { Redirect as RouterRedirect } from 'react-router-dom';
import Router from '../Services/Router';

export default class Redirect extends React.Component {
  render() {
    const to = Router.exists(this.props.to) ?
      Router.to(this.props.to) : this.props.to;
    
    return <RouterRedirect to={to} />
  }
}