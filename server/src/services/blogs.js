const path = require('path');
const fs = require('fs');

const config = require('../config');
const cacheClient = require("../clients/cache").client;

const blogsPath = path.join(global.__basedir, '../blogs/markdown');

function getBlogList() {
    return cacheClient.get('blog_list')
}

function searchBlogs(search) {
    const fuse = cacheClient.get('blog_search')

    const results = fuse.search(search, { limit: 20 });

    return results.map(result => result.item);
}

function getRelated(link) {
    const blogMap = cacheClient.get('blog_map');
    const relatedMap = cacheClient.get('blog_related');

    const related = relatedMap[link];

    if (!related) {
        throw new Error('Blog does not exist');
    }

    const relatedBlogs = [];
    for (const link of related) {
        relatedBlogs.push(blogMap[link]);
    }

    return relatedBlogs;
}

/**
 * Tests if a blog exists
 */
function blogExists(blogId) {
    const blogMap = cacheClient.get(`blog_map`);
    return new Boolean(blogMap[blogId]);
}

/**
 * Retrieves the cached contents of a blog
 * only if deployed in production. Throws
 * an error if the blog does not exist.
 */
function getBlog(blogId) {

    let content = cacheClient.get(`blog_content_${blogId}`);

    if (content) {
        return content;
    }

    const blogMap = cacheClient.get(`blog_map`);

    const blog = blogMap[blogId];

    if (!blog) {
        throw new Error('Blog does not exist');
    }

    const blogFile = path.join(blogsPath, blog.file);

    if (fs.statSync(blogFile).isFile()) {

        content = fs.readFileSync(blogFile).toString();

        if (config.PRODUCTION) {
            cacheClient.set(`blog_content_${blogId}`, content, 30);
        }
        
        return { blog, content };
    }

    throw new Error('Blog does not exist');
}

module.exports = {
    searchBlogs,
    getBlog,
    getBlogList,
    getRelated,
    blogExists
}