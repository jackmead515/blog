import axios from 'axios';

export async function fetchBlogList(page) {
    const response = await axios.get('api/blogs', {
        params: {
            page: page
        }
    });
    return response.data;
}

export async function fetchBlog(id) {
    const response = await axios.get(`api/blogs/${id}`);
    return response.data;
}

export async function getRelatedBlogs(id) {
    const response = await axios.get(`api/blogsRelated/${id}`);
    return response.data;
}

export async function getBlogStats(id) {
    const response = await axios.get(`api/blogsStats/${id}`);
    return response.data;
}


export async function getTaggedBlogs(id) {
    const response = await axios.get(`api/blogsTagged/${id}`);
    return response.data;
}

export async function searchBlogs(search) {
    const response = await axios.get('api/blogsSearch', {
        params: {
            search
        }
    });
    return response.data;
}
