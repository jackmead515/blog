import React, { Component } from 'react';
import FAIcon from 'react-fontawesome';

export default class Share extends Component {
  render() {
    const title = encodeURIComponent(document.title);
    const url = encodeURIComponent(window.location.href);

    const githubUrl = 'https://github.com/jackmead515/blog';
    const linkedinUrl = `https://linkedin.com/shareArticle?url=${url}&title=${title}`;
    const twitterUrl = `https://twitter.com/home?status=${title}+${url}`;
    const redditUrl = `https://www.reddit.com/submit?url=${url}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&title=${title}`;

    return (
      <div className="blog_share">
        <a
          className="blog_share-twitter"
          href={twitterUrl}
          target='_blank'
          rel='noopener noreferrer'
          alt='Share on Twitter'
        >
          <FAIcon name="twitter" />
          <div>Share</div>
        </a>
        <a
          className="blog_share-reddit"
          href={redditUrl}
          target='_blank'
          rel='noopener noreferrer'
          alt='Share on Reddit'
        >
          <FAIcon name="reddit" />
          <div>Share</div>
        </a>
        <a
          className="blog_share-github"
          href={githubUrl}
          target='_blank'
          rel='noopener noreferrer'
          alt='Share on Reddit'
        >
          <FAIcon name="github" />
          <div>Fork</div>
        </a>
        <a
          className="blog_share-facebook"
          href={facebookUrl}
          target='_blank'
          rel='noopener noreferrer'
          alt='Share on Facebook'
        >
          <FAIcon name="facebook" />
          <div>Share</div>
        </a>
        <a
          className="blog_share-linkedin"
          href={linkedinUrl}
          target='_blank'
          rel='noopener noreferrer'
          alt='Share on Linkedin'
        >
          <FAIcon name="linkedin" />
          <div>Share</div>
        </a>
      </div>
    );
  }
}
