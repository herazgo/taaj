import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Router from '../Services/Router';

export default class Link extends React.Component {
  static defaultProps = {
    className: ''
  }

  render() {
    const to = Router.exists(this.props.to) ?
      Router.to(this.props.to) : this.props.to;

    return (
      <RouterLink to={to} className={this.props.className}>
        {this.props.children}
      </RouterLink>
    )
  }
}