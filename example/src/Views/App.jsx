import React from 'react'
import logo from '../Assets/logo.svg';
import '../Assets/app.scss';

export default ({ view }) => (
  <div className="app">
    <img src={logo} className="logo" alt="logo" />

    { view }
  </div>
)