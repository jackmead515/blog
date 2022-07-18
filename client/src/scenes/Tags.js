import React from "react";

import * as services from '../services';
import SearchBar from "../components/search/SearchBar";
import BlogRow from "../components/blog/BlogRow";

export default class Tags extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      blogs: []
    };
  }

  async componentDidMount() {
    const pathSplits = window.location.pathname.split('/');
    const tag = pathSplits[2];

    const blogs = await services.getTaggedBlogs(tag);

    this.setState({ blogs });
  }

  render() {
    return (
      <div className="tags">
        <div className="tags__wrapper">
          <SearchBar />
          <div className="bloglist">
              {this.state.blogs.map((blog, i) => {
                  return <BlogRow blog={blog} key={i} />
              })}
          </div>
        </div>
      </div>
    );
  }

}
