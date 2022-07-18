import React from "react";

import * as services from '../../services';

import showdown from "showdown";
import Prism from 'prismjs';

import LocalDate from "../generic/LocalDate";
import Tag from '../generic/Tag';

const converter = new showdown.Converter({
    tables: true,
    tasklists: true,
    openLinksInNewWindow: true,
    emoji: true
});

converter.setFlavor('github');

export default class Blog extends React.PureComponent {

    constructor(props) {
      super(props);
  
      this.state = {
        content: undefined
      }
    }

    componentDidMount() {
      const htmlContent = converter.makeHtml(this.props.content);

      this.setState({ content: htmlContent }, () => {
        Prism.highlightAll();
      });
    }

    render() {
      const { blog } = this.props;
      const { content } = this.state;

      if (!content) {
        return <></>
      }

      return (
        <div className="blog">
          <div className="blog__heading">
            <div className="blog__heading__tags">
              {blog.tags.map((tag, i) => <Tag key={i}>{tag}</Tag>)}
            </div>
            <h1>{blog.title}</h1>
            <h2>{blog.subtitle}</h2>
            <LocalDate date={blog.date}></LocalDate>
          </div>
          <div
            className="blog__content" 
            dangerouslySetInnerHTML={{__html: content}} />
        </div>
      );
    }

}