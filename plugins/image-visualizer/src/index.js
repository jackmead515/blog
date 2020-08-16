import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as config from './config';

import './index.css';
import './image.css';

config.initialize();

ReactDOM.render(<App />, document.getElementById('root'));
