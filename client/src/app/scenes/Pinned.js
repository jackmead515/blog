import React, { Component } from 'react'
import axios from 'axios';
import { connect } from 'react-redux'

import { asyncRetry } from '../util/retry';
import { refreshPinnedData } from '../actions/list';

import AttentionBlock from '../components/AttentionBlock';
import MiniListing from '../components/MiniListing';

export class Pinned extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    this.refreshPinned();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.loading !== nextState.loading ||
      this.props.pinned.length !== nextProps.pinned.length;
  }

  async refreshPinned() {
    const { pinned } = this.props;

    const requests = pinned.map((head) => asyncRetry(() => axios.get(`/blogs/head/${head.link}`)));

    Promise.all(requests).then((data) => {
      const heads = data.map((d) => d.data);
      this.props.dispatch(refreshPinnedData(heads));
      this.setState({ loading: false });
    }).catch((err) => {
      console.log(err);
    });
  }

  renderContent() {
    const { pinned, mobile } = this.props;

    if (pinned.length) {
      return (
        <AttentionBlock
          defaultClosed={mobile ? true : false}
          title="Favorites"
          containerClassName="pinned"
          contentClassName="pinned-listings"
        >
          {pinned.map((head, i) => <MiniListing key={i} listing={head} />)}
        </AttentionBlock>
      );
    }

    return null;
  }

  render() {
    const { loading } = this.state;
    return loading ? null : this.renderContent();
  }
}

const mapStateToProps = (state) => {
  return {
    pinned: state.list.pinned
  }
}

export default connect(mapStateToProps)(Pinned)
