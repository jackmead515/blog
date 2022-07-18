import React from "react";

export default function BlogBox({ blog }) {
  return (
    <div className="blogbox">
      <a
        href={`/blogs/${blog.link}`}
        className="blogbox__image"
        style={{ backgroundImage: `url("${blog.image}")` }}>
        <div className="gradient"></div>
        <div className="blogbox__title">
          <h2>{blog.title}</h2>
          <h3>{blog.subtitle}</h3>
        </div>
      </a>
    </div>
  );
}