import React, { Component } from 'react'
import { connect } from 'react-redux'

import { pushError } from '../../actions/messages';

import SearchBar from '../SearchBar';
import Template from '../Template';
import Post from './Post';
import Stats from './Stats';
import Tags from './Tags';
import PrevNext from './PrevNext';
import Suggest from './Suggest';
import Comments from './Comments';
import Related from './Related';
import Recent from './Recent';
import Popular from './Popular';
import Share from './Share';
//import Donate from './Donate';

export class Blog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      head: {}
    };

    this.blogLoadFailed = this.blogLoadFailed.bind(this);
    this.blogLoadSuccess = this.blogLoadSuccess.bind(this);
  }

  blogLoadFailed() {
    this.props.dispatch(
      pushError(`Failed to fetch blog.`)
    );
  }

  blogLoadSuccess(head) {
    this.setState({ head });
  }

  getBlogSource() {
    const { name } = this.props.match.params
    return `/blogs/get/${name}`
  }

  getStatsSource() {
    const { name } = this.props.match.params
    return `/blogs/stats/${name}`
  }

  render() {
    return (
      <Template>
        <SearchBar />
        <Tags tags={this.state.head.tags} />
        <Post
          source={this.getBlogSource()}
          onLoaded={this.blogLoadSuccess}
          onFailed={this.blogLoadFailed}
        />
        <Stats
          id="stats"
          source={this.getStatsSource()}
        />
        <Share />
        {/* <Donate /> */}
        <Comments />
        <PrevNext
          prev={this.state.head.prev}
          next={this.state.head.next}
        />
        <Related type="mids" link={this.state.head.link} />
        {/* <div className="blog_break">
          <h2>Thanks for Viewing! Explore More</h2>
        </div> */}
        <Popular />
        <Recent />
        <Suggest />
      </Template>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps)(Blog)
