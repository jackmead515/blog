import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios';
import moment from 'moment';
import { Helmet } from 'react-helmet';

import { asyncRetry } from '../../util/retry';
import LineLoader from '../../components/LineLoader';
import Renderer from '../../components/Renderer';
import PinButton from '../../components/PinButton';

import { addToPinned, removeFromPinned } from '../../actions/list';

import * as config from '../../../config';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      components: [],
      head: {
        title: '',
        subtitle: '',
        date: ''
      },
      loading: true,
      error: "",
      pinState: false
    }

    this.onClickPin = this.onClickPin.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { loading, head } = this.state;
    const { pinned } = nextProps;

    if (!loading) {
      if (pinned.find((h) => h.link === head.link)) {
        this.setState({ pinState: false });
      } else {
        this.setState({ pinState: true });
      }
    }
  }

  componentWillMount() {
    this.fetchPost();
  }

  async fetchPost() {
    const { pinned } = this.props;
    try {
      const response = await asyncRetry(() => axios.get(this.props.source));
      const { contents, head } = response.data;
      const components = Renderer.build(contents);
      const pinState = pinned.find((h) => h.link === head.link) ? false : true;
      this.setState({ components, head, pinState, loading: false });
      this.props.onLoaded(head);
    } catch(e) {
      console.log(e);
      this.props.onFailed();
    }
  }

  onClickPin() {
    const { head, pinState } = this.state;

    if (pinState) {
      this.props.dispatch(addToPinned(head));
    } else {
      this.props.dispatch(removeFromPinned(head.link));
    }
  }

  renderHeading() {
    const { pinState } = this.state;
    

    return (
      <div className="blog_heading">
        <PinButton
          onClickPin={this.onClickPin}
          pinState={pinState}
        />
        <h1>{this.state.head.title}</h1>
        <h2>{this.state.head.subtitle}</h2>
        <span>{moment(this.state.head.date*1000).format("MMM, Do YYYY")}</span>
      </div>
    )
  }

  renderHelmet() {
    const { head } = this.state;
    const keywords = head.tags.join(',');
    const title = `Self Proclaimed Engineer's Blog | ${head.title}`;
    const description = head.description ? head.description : title;
    let prev = null;
    if (head.prev) {
      prev = <link rel="prev" href={`${config.data.baseUrl}/blog/${head.prev.link}`} />;
    }
    let next = null;
    if (head.next) {
      next = <link rel="next" href={`${config.data.baseUrl}/blog/${head.next.link}`} />;
    }
    const ldJson = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "name": "Blogs",
        "item": "https://speblog.org"
      },{
        "@type": "ListItem",
        "position": 2,
        "name": head.title,
        "item": window.location.href
      }]
    };

    return (
      <Helmet
        defaultTitle="Self Proclaimed Engineer's Blog | Programming and Engineering Stuff"
      >
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        {prev}
        {next}
        <link rel="canonical" href={config.data.baseUrl} />
        <meta property="og:site_name" content="Self Proclaimed Engineer" />
        <meta property="og:description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={`${config.data.baseUrl}/${head.image}`} />
        <script type="application/ld+json">
          {JSON.stringify(ldJson)}
        </script>
      </Helmet>
    )
  }

  renderContent() {
    return (
      <div className="blog_container" style={{marginTop: 10}}>
        {this.renderHelmet()}
        {this.renderHeading()}
        {this.state.components}
      </div>
    )
  }

  renderLoading() {
    return (
      <div className="blog_container" style={{marginTop: 10}}>
        <LineLoader />
      </div>
    )
  }
  
  render() {
    const { loading } = this.state;
    return loading ? this.renderLoading() : this.renderContent();
  }
}

const mapStateToProps = (state) => {
  return {
    pinned: state.list.pinned
  }
}

export default connect(mapStateToProps)(Post)