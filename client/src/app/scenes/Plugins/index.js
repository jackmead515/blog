import React, { Component } from 'react';

import Renderer from '../../components/Renderer';

import Navigation from '../Navigation';
import Footer from '../Footer';

import { getBaseUrl } from '../../../config';

const content = Renderer.build([
  {
    'type': 'plugin',
    'props': {
      'source': 'plugin/d3-graphs',
      'id': 'live-updating',
      'width': '100%',
      'height': '100',
    },
  },
  {
    'type': 'p',
    'contents': 'One of the neat things about the way I designed my blog is how easy it is to create seperate plugins for awesome animations and toys. Each plugin is it\'s own seperate react app that is built, compiled down to a minimal amount, and then rendered seperately in an iframe on an api call.',
  },
  {
    'type': 'p',
    'contents': 'It\'s what makes this blog so expandable and modular! But really, I\'m just using React in it\'s intended purpose: to be modular. You can freely checkout the source code to the blog to understand how I create it and keep all passwords and keys a secret!',
  },
  {
    'type': 'a',
    'props': {
      'target': 'tab',
      'href': 'https://github.com/jackmead515/blog',
    },
    'contents': 'Github Blog Source Code',
  },
  {
    'type': 'p',
    'contents': 'Listed below is all of the plugins I\'ve made so far. Check back in the future for more! Enjoy :)',
  },
  {
    'type': 'div',
    'props': {
      'embed': true,
    },
    'contents': '<h3 style="border-top: 1px solid #cccccc;padding-top: 20px;">Capacitor Sensor Oscilloscope Visualizer</h3>',
  },
  {
    'type': 'p',
    'contents': 'This visualizer shows how a capacitor tied to ground from a sensor input can delay the feedback signal. What is displayed is the simulated voltage that could occur. (units are not at all accurate or intended to be accurate)',
  },
  {
    'type': 'plugin',
    'props': {
      'source': 'plugin/capacitor-sensor',
      'id': 'capacitor-sensor',
      'width': '100%',
      'height': '400',
    },
  },
  {
    'type': 'div',
    'props': {
      'embed': true,
    },
    'contents': '<h3 style="border-top: 1px solid #cccccc;padding-top: 20px;">Seperate Axis / Gravity Collision Simulation</h3>',
  },
  {
    'type': 'p',
    'contents': 'This light physics simulation is built using the seperate axis theorem and a simple gravity algorithm. It\'s purpose is to show how objects will collide together in a game. The algorithms used are not meant to be pin point realistic physics, but, they are good enough for a dumb game!',
  },
  {
    'type': 'p',
    'contents': 'As of August 15, 2020, this simulator just got a fancy new upgrade! As computation and efficency is important to this simulator, I converted the engine into Rust and compiled it via WASM! After I optimized the Rust code the best I could, I ended up with 20 FPS bmp in improvement! CHECK IT OUT!!',
  },
  {
    'type': 'a',
    'props': {
      'target': 'tab',
      'href': '/plugin/sat-tester',
    },
    'contents': 'Fullscreen Collision Tester',
  },
  {
    'type': 'plugin',
    'props': {
      'source': 'plugin/sat-tester',
      'id': 'sat-tester',
      'width': '100%',
      'height': '400',
    },
  },
  {
    'type': 'div',
    'props': {
      'embed': true,
    },
    'contents': '<h3 style="border-top: 1px solid #cccccc;padding-top: 20px;">My Personal Book List</h3>',
  },
  {
    'type': 'p',
    'contents': 'Now this is freaking cool. The table you see below isn\'t actually a react plugin rendered in an iframe. This is actually a snapshot of a Google Sheets spreadsheet! What your seeing is the up-to-date sheet rendered directly in the browser. All I have to do is update it online and it will dynamically load. I plan to do a blog about how you can accomplish this as well. But for now, enjoy!!',
  },
  {
    'type': 'remote',
    'source': `${getBaseUrl()}/lists/books`,
  },
  {
    'type': 'div',
    'props': {
      'embed': true,
    },
    'contents': '<h3 style="border-top: 1px solid #cccccc;padding-top: 20px;">COVID-19 Visualizer</h3>',
  },
  {
    'type': 'p',
    'contents': 'Updated as often as I get the oppurtunity, this is a visualizer for the COVID-19 Coronavirus infectious disease that is affecting the world in 2020. It shows the geography of the spread around the world, in addition to the exponential growth of cases and the linear growth of recovered patients',
  },
  {
    'type': 'a',
    'props': {
      'target': 'tab',
      'href': '/plugin/covid19',
    },
    'contents': 'Fullscreen COVID-19 Map',
  },
  {
    'type': 'plugin',
    'props': {
      'source': 'plugin/covid19',
      'id': 'covid19',
      'width': '100%',
      'height': '600',
    },
  },
  {
    'type': 'div',
    'props': {
      'embed': true,
    },
    'contents': '<h3 style="border-top: 1px solid #cccccc;padding-top: 20px;">Micro-frontend Inception</h3>',
  },
  {
    'type': 'p',
    'contents': 'Okay but really, you gotta listen to this. What you see before you is the Widgeter plugin. Which, itself, is a micro frontend. But, even better, the widgeter tool allows you to add \'Plugins\' to your dashboard which themselves are microfrontends!! Dudddeee!! This just shows you the power of microfrontends and how expandable they really are. I wrote the Seperate Axis Theorem (Collision) Simulator forever ago. But because I wrote it as a microfrontend, it still works anywhere I want to put it! Wicked sweet!!',
  },
  {
    'type': 'a',
    'props': {
      'target': 'tab',
      'href': '/plugin/widgeter',
    },
    'contents': 'Fullscreen Widgeter',
  },
  {
    'type': 'plugin',
    'props': {
      'source': 'plugin/widgeter',
      'id': 'widgeter',
      'width': '100%',
      'height': '1000',
    },
  },
]);

export default class About extends Component {

  render() {
    return (
      <>
        <Navigation/>
        <div className="padded_container">
          <div className="blog_container">
            <div className="blog_content">
              {content}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
}
