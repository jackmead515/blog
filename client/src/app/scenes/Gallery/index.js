import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import { asyncRetry } from '../../util/retry';
import { pushError } from '../../actions/messages';

import Image from '../../components/Image';

import Template from '../Template';

export class Gallery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: [],
    };
  }

  componentDidMount() {
    this.fetchImages();
  }

  async fetchImages() {
    try {
      const response = await asyncRetry(() => axios.get('/images/list'));
      this.setState({ images: response.data });
    } catch (e) {
      this.props.dispatch(pushError('Failed to fetch images. Please try again later!'));
    }
  }

  renderImages() {
    const { images } = this.state;

    return images.map((image, i) => <Image zoomable key={i} width={'100%'} source={`image/${image}`} />);
  }

  render() {
    return (
      <Template>
        <div className="gallery_container">
          {this.renderImages()}
        </div>
      </Template>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Gallery);
