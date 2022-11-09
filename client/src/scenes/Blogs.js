import React from "react";
import { Helmet } from 'react-helmet';

import Blog from "../components/blog/Blog";
import Related from "../components/blog/Related";
import Share from "../components/blog/Share";
import Stats from '../components/blog/Stats';
import SearchBar from "../components/search/SearchBar";
import SectionHeader from '../components/blog/SectionHeader';
import NextPrev from "../components/blog/NextPrev";

import * as services from '../services';

export default class Blogs extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      blog: undefined,
      content: undefined,
      related: [],
      stats: { times: [], amount: 0 }, 
      loading: true
    };
  }

  async componentDidMount() {
    const pathSplits = window.location.pathname.split('/');
    const link = pathSplits[2];
    await this.fetchBlog(link);
    await this.fetchOther(link);
  }

  async fetchBlog(link) {
    const { blog, content } = await services.fetchBlog(link);

    this.setState({ blog, content, loading: false });
  }

  async fetchOther(link) {

    const [related, stats] = await Promise.all([
      services.getRelatedBlogs(link),
      services.getBlogStats(link)
    ]);

    this.setState({ related, stats });
  }

  renderRelated() {
    const { related } = this.state;

    if (!related?.length) {
      return;
    }

    return (
      <>
        <SectionHeader>Related</SectionHeader>
        <Related related={related} />
      </>
    );
  }

  renderStats() {
    const { stats, blog } = this.state;

    if (stats?.times?.length < 5) {
      return;
    }

    return (
      <>
        <SectionHeader>Statistics</SectionHeader>
        <Stats id={blog.link} stats={stats} />
      </>
    );
  }

  renderHelmet() {
    const { blog } = this.state;
  
    const keywords = blog.tags.join(',');
    const title = `Self Proclaimed Engineer's Blog | ${blog.title}`;
    const description = blog.description ? blog.description : title;
  
    let prev = null;
    if (blog.prev) {
      prev = <link rel="prev" href={`/blog/${blog.prev.link}`} />;
    }
    let next = null;
    if (blog.next) {
      next = <link rel="next" href={`/blog/${blog.next.link}`} />;
    }

    const ldJson = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [{
        '@type': 'ListItem',
        'position': 1,
        'name': 'Blogs',
        'item': window.location.origin,
      }, {
        '@type': 'ListItem',
        'position': 2,
        'name': blog.title,
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
        <link rel="canonical" href='/' />
        <meta property="og:site_name" content="Self Proclaimed Engineer" />
        <meta property="og:description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={blog.image} />
        <script type="application/ld+json">
          {JSON.stringify(ldJson)}
        </script>
      </Helmet>
    );
  }

  render() {
    if (this.state.loading) {
      return <></>
    }

    const { blog, content } = this.state;
    
    return (
      <div className="blogs">
        {this.renderHelmet()}
        <div className="blogs__wrapper">
          <SearchBar />
          <Blog blog={blog} content={content}></Blog>
          <SectionHeader>Thanks For Reading!</SectionHeader>
          <NextPrev 
            next={blog?.metadata?.next}
            prev={blog?.metadata?.previous}>
          </NextPrev>
          {this.renderStats()}
          <SectionHeader>Share</SectionHeader>
          <Share />
          {this.renderRelated()}
        </div>
      </div>
    );
  }

}
