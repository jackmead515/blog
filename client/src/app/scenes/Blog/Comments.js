import React, { Component } from 'react';

export default class Comments extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      loading: true,
    };
  }

  UNSAFE_componentWillMount() {
    const script = document.createElement('script');
    script.innerHTML = `
      var disqus_config = function () {
        this.page.url = '${window.location.href}';
        this.page.identifier = '${window.location.pathname}';
      };
      (function() {
      var d = document, s = d.createElement('script');
      s.src = 'https://speblog-1.disqus.com/embed.js';
      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);
      })();
    `;
    document.body.appendChild(script);
  }

  renderGithubIssueSuggest() {
    return (
      <div className="blog_comments-github">
        <p>
          Have a question? Feel free to submit a Github issue&nbsp;<a href="https://github.com/jackmead515/blog/issues/new" target="_blank" rel="noopener noreferrer">here!</a>
        </p>
      </div>
    );
  }

  render() {
    return (
      <div
        className="blog_comments"
        style={{ marginTop: 10 }}
      >
        <h2>Comments</h2>
        {this.renderGithubIssueSuggest()}
        <div id="disqus_thread"></div>
      </div>
    );
  }
}
