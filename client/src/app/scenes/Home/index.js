import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios';

import { asyncRetry } from '../../util/retry';
import { pushError } from '../../actions/messages';

import SearchBar from '../SearchBar';
import Listing from '../../components/Listing';
import Navigation from '../Navigation';
import Tags from '../Tags';
import Popular from '../Popular';
import Footer from '../Footer';
import Pinned from '../Pinned';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listings: [],
      loading: false,
      page: 0,
      windowWidth: 0
    }

    this.scrollEnabled = true;
    this.updateScrollPosition = this.updateScrollPosition.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  async componentDidMount() {
    window.addEventListener("scroll", this.updateScrollPosition);
    window.addEventListener("resize", this.updateDimensions);
    this.updateDimensions();
    await this.fetchList();
    this.updateScrollPosition();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.loading !== nextState.loading ||
      (this.state.windowWidth > 850 && nextState.windowWidth <= 850);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.updateScrollPosition);
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateScrollPosition() {
    const scrollTop = (window.pageYOffset || window.scrollTop) - (window.clientTop || 0);
    const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
    if (scrollTop + window.innerHeight >= scrollHeight && this.scrollEnabled) {
      this.fetchList();
    } else if (scrollHeight === window.innerHeight && this.scrollEnabled) {
      this.fetchList();
    }
  }

  updateDimensions() {
    const width = window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    this.setState({ windowWidth: width });
  }

  fetchList() {
    const { listings, page, loading } = this.state;
    return new Promise((resolve) => {
      if (!loading) {
        try {
          this.setState({ loading: true }, async () => {
            const response = await asyncRetry(() => axios.get(`/blogs/list/page?number=${page}`));
            if(response.data.length <= 0) {
              this.scrollEnabled = false;
            }
            this.setState({
              listings: listings.concat(response.data),
              page: page+1,
              loading: false
            }, resolve);
          });
        } catch(e) {
          this.props.dispatch(pushError(`Failed to fetch blogs! Please try again later.`))
          return resolve();
        }
      } else {
        return resolve();
      }
    });
  }

  renderListings() {
    const { listings } = this.state;

    return listings.map((listing, index) => {
      return <Listing key={index} listing={listing} />
    });
  }

  render() {
    const mobile = this.state.windowWidth <= 850;
    return (
      <>
        <Navigation/>
        <div className="home_container">
          <div className="home_listings">
            {this.renderListings()}
          </div>
          <div className="home_sidebar">
            <SearchBar />
            <Popular mobile={mobile} />
            <Tags mobile={mobile} />
            <Pinned mobile={mobile} />
          </div>
        </div>
        <Footer />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps)(Home)