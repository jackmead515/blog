import React, { Component } from 'react';
import { Route, Router, Redirect, Switch } from 'react-router';
import { createBrowserHistory } from 'history';
import { Helmet } from 'react-helmet';

import * as config from '../../config';

import Toast from '../components/Toast';
import AdBlock from '../components/AdBlock';
import Home from './Home';
import About from './About';
import Gallery from './Gallery';
import Blog from './Blog';
import Contact from './Contact';
import Tag from './Tag';
import Plugins from './Plugins';

export default class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.history = createBrowserHistory();
  }

  render() {
    return (
      <Router history={this.history}>
        <Toast />
        <AdBlock />
        <Helmet>
          <title>{config.data.blogTitle}</title>
          <meta name="description" content={config.data.blogDescription} />
          <meta name="keywords" content={config.data.blogKeywords} />
          <link rel="icon" type="image/png" sizes="1024x2014" href={`${config.data.baseUrl}/image/fav/favicon-1024.png`} />
          <link rel="icon" type="image/png" sizes="256x256" href={`${config.data.baseUrl}/image/fav/favicon-256.png`} />
          <link rel="canonical" href={config.data.baseUrl} />
        </Helmet>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
          <Route exact path="/gallery" component={Gallery} />
          <Route exact path="/contact" component={Contact} />
          <Route exact path="/plugins" component={Plugins} />
          <Route exact path="/tag/:name" component={Tag} />
          <Route exact path="/blog/:name" component={Blog} />
        </Switch>
      </Router>
    )
  }
}
