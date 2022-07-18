import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom/client';

import './styles/index.scss';

import Root from './root';

const dev = process.env.NODE_ENV === 'development' ? true : false;

axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.baseURL = dev ? 'http://127.0.0.1:1234' : 'https://www.speblog.org';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Root />
);
