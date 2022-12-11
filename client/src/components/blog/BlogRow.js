import React from "react";

import LocalDate from '../generic/LocalDate';

export default function BlogRow({ blog }) {
  return (
    <div className="blogrow">
      <a
        href={`/blogs/${blog.link}`}
        className="blogrow__heading"
        style={{ backgroundImage: `url("${blog.image}")` }}>
        <div className="gradient"></div>
        <div className="title">
          <h2>{blog.title}</h2>
          <h3>{blog.subtitle}</h3>
        </div>
      </a>
      <div className="blogrow__description">
        <p>{blog.description}</p>
        <LocalDate date={blog.date} />
      </div>
    </div>
  );
}