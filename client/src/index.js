import React from 'react';
import ReactDOM from 'react-dom';
import { PersistGate } from 'redux-persist/lib/integration/react'
import { Provider } from 'react-redux';
import axios from 'axios';

import { persistor, store } from './configureStore';
import * as serviceWorker from './serviceWorker';
import * as config from './config';
import AppContainer from './app/scenes/AppContainer';

import './app/styles/index.css';

config.initialize();

axios.defaults.headers.common[ 'Content-Type' ] = 'application/json';
axios.defaults.baseURL = config.data.baseUrl;

ReactDOM.render((
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <AppContainer />
    </Provider>
  </PersistGate>
), document.getElementById('root'));

serviceWorker.unregister();
