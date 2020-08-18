import React, { Component } from 'react';

import * as config from '../../../config';

export default class Donate extends Component {
  render() {
    return (
      <div className="blog_donate">
        <a
          className="bmc-button"
          target="_blank"
          href="https://www.buymeacoffee.com/uLw35hoN7"
        >
          <img
            src={`${config.data.baseUrl}/image/generic/buymecoffee.svg`}
            alt="Buy me a coffee"
          />
          <span>
                Buy me a coffee
          </span>
        </a>
        <a
          target="_blank"
          href="https://www.patreon.com/bePatron?u=9085616"
          className="pat-button"
        >
          <img
            src={`${config.data.baseUrl}/image/generic/patreon.png`}
            alt="Donate to Patreon"
          />
        </a>
      </div>
    );
  }
}
