import React, { Component } from 'react';
import FAIcon from 'react-fontawesome';
import { connect } from 'react-redux';
import moment from 'moment';
import { Helmet } from 'react-helmet';

import LineLoader from '../../components/LineLoader';
import PinButton from '../../components/PinButton';

import { highlightCode } from '../../util/markdown';
import { getBlog } from '../../services/blog';
import { addToPinned, removeFromPinned } from '../../actions/list';
import * as config from '../../../config';


class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contents: null,
      head: {
        title: '',
        subtitle: '',
        date: '',
      },
      loading: true,
      error: '',
      pinState: false,
    };

    this.onClickPin = this.onClickPin.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { loading, head, pinState } = this.state;
    const { pinned } = nextProps;

    const newPinState = pinned.find(h => h.link === head.link) ? false : true;

    if (!loading && pinState !== newPinState) {
      this.setState({ pinState: newPinState });
    }
  }

  componentDidMount() {
    this.fetchPost();
  }

  async fetchPost() {
    const { pinned } = this.props;
    try {
      const { contents, head } = await getBlog(this.props.source);
      const pinState = pinned.find(h => h.link === head.link) ? false : true;
      this.setState({ contents, head, pinState, loading: false }, () => {
        if (head.markdown) {
          highlightCode('blog-markdown');
        }
        this.props.onLoaded(head);
      });
    } catch (e) {
      console.log('FAILED TO GET BLOG', e);
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
        <span><FAIcon name="clock-o"/> {moment(this.state.head.date*1000).format('MMM, Do YYYY')}</span>
      </div>
    );
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
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [{
        '@type': 'ListItem',
        'position': 1,
        'name': 'Blogs',
        'item': 'https://speblog.org',
      }, {
        '@type': 'ListItem',
        'position': 2,
        'name': head.title,
        'item': window.location.href,
      }],
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
    );
  }

  renderContents() {
    const { contents, head } = this.state;

    if (head.markdown) {
      return <div id="blog-markdown" className="blog_content markdown" dangerouslySetInnerHTML={{ __html: contents }} />;
    }

    return <div className="blog_content">{contents}</div>;
  }

  renderContent() {
    return (
      <div className="blog_container">
        {this.renderHelmet()}
        {this.renderHeading()}
        {this.renderContents()}
      </div>
    );
  }

  renderLoading() {
    return (
      <div className="blog_container">
        <LineLoader />
      </div>
    );
  }
  
  render() {
    const { loading } = this.state;
    return loading ? this.renderLoading() : this.renderContent();
  }
}

const mapStateToProps = state => ({
  pinned: state.list.pinned,
});

export default connect(mapStateToProps)(Post);