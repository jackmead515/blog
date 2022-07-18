import React from "react";

import * as services from '../../services';

import BlogRow from "./BlogRow";

export default class BlogList extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            blogs: []
        };
    }
    
    async componentDidMount() {
        const blogs = await services.fetchBlogList();
        this.setState({ blogs });
    }

    componentDidUpdate() {

    }

    render() {
        return (
            <div className="bloglist">
                {this.state.blogs.map((blog, i) => {
                    return <BlogRow blog={blog} key={i} />
                })}
            </div>
        );
    }

}