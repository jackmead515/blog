import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { asyncRetry } from '../../util/retry';
import { pushError } from '../../actions/messages';

import SearchBar from '../SearchBar';
import Listing from '../../components/Listing';
import Navigation from '../Navigation';
import Footer from '../Footer';
import Tags from '../Tags';
import Popular from '../Popular';

class Tag extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listings: [],
      loading: false,
      page: 0,
    };

    this.scrollEnabled = true;
    this.updateScrollPosition = this.updateScrollPosition.bind(this);
  }

  async componentDidMount() {
    window.addEventListener('scroll', this.updateScrollPosition);
    await this.fetchList();
    this.updateScrollPosition();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.updateScrollPosition);
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

  fetchList() {
    const { name } = this.props.match.params;
    const { listings, page, loading } = this.state;
    return new Promise(resolve => {
      if (!loading) {
        try {
          this.setState({ loading: true }, async () => {
            const response = await asyncRetry(() => axios.get(`/search/tag?tag=${name}&number=${page}`));
            if (response.data.length <= 0) {
              this.scrollEnabled = false;
            }
            this.setState({
              listings: listings.concat(response.data),
              page: page+1,
              loading: false,
            }, resolve);
          });
        } catch (e) {
          this.props.dispatch(pushError('Failed to fetch blogs! Please try again later.'));
          resolve();
        }
      } else {
        resolve();
      }
    });
  }

  renderListings() {
    const { listings } = this.state;

    return listings.map((listing, index) => <Listing key={index} listing={listing} />);
  }

  render() {
    const { name } = this.props.match.params;
    return (
      <>
        <Navigation/>
        <h2 className="home_tag-title">{`Showing Tag: '${name}'`}</h2>
        <div className="home_container">
          <div className="home_container_content">
            <div className="home_listings">
              {this.renderListings()}
            </div>
            <div className="home_sidebar">
              <SearchBar />
              <Tags />
              <Popular />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Tag);