import React from "react";
import BlogBox from "./BlogBox";

export default function Related({ related }) {

    return (
        <div className="related">
            {related.map((blog, i) => {
                return <BlogBox blog={blog} key={i} />
            })}
        </div>
    )
}