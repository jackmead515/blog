import React from "react";

import showdown from "showdown";
import Prism from 'prismjs';

import LocalDate from "../generic/LocalDate";
import Tag from '../generic/Tag';

import mermaid from 'mermaid';

const converter = new showdown.Converter({
    tables: true,
    tasklists: true,
    openLinksInNewWindow: true,
    emoji: true
});

converter.setFlavor('github');

/**
 * Render any and all script tags that are in the blog
 */
// function handleScripts(blog) {
//   const element = document.getElementById(blog.link);
//   if (element) {
//     const scripts = element.querySelectorAll('script');
//     scripts.forEach(script => {
//       eval(script.textContent);
//     });
//   }
// }

/**
 * Render any and all mermaid diagrams that are in the blog
 */
function handleMermaid(blog) {
  const element = document.getElementById(blog.link);
  if (element) {
    const mermaidElements = element.querySelectorAll('pre.language-mermaid');
    for (const mermaidElement of mermaidElements) {
      const graphDef = mermaidElement.childNodes[0].textContent;
      mermaidElement.classList = ['mermaid'];
      const svgCode = mermaid.mermaidAPI.render('graph', graphDef);
      mermaidElement.innerHTML = svgCode;
    }
  }
}

export default class Blog extends React.PureComponent {

    constructor(props) {
      super(props);
  
      this.state = {
        content: undefined
      }
    }

    componentDidMount() {
      const { blog, content } = this.props;
      const htmlContent = converter.makeHtml(content);

      mermaid.mermaidAPI.initialize({ 
        startOnLoad: false,
        theme: 'dark',
        fontFamily: 'sans-serif',
      });

      this.setState({ content: htmlContent }, () => {
        Prism.highlightAll();
        //handleScripts(blog);
        handleMermaid(blog);
      });
    }

    render() {
      const { blog } = this.props;
      const { content } = this.state;

      if (!content) {
        return <></>
      }

      return (
        <div className="blog" id={blog.link}>
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
            id={blog.link}
            dangerouslySetInnerHTML={{__html: content}} />
        </div>
      );
    }

}