const NodeCache = require('node-cache');
const path = require('path');
const fs = require('fs');
const YAML = require('yaml');
const moment = require('moment');
const Fuse = require('fuse.js');

const blogsMetaPath = path.join(global.__basedir, '../blogs/meta');
const relatedPath = path.join(global.__basedir, '../resources/related.json');

const client = new NodeCache({
    stdTTL: 10,
    checkperiod: 5,
});

function loadBlogs() {

    // read the meta data for each blog and sort by date
    const blogList = fs.readdirSync(blogsMetaPath)
        .map(file => {
            const fileContent = fs.readFileSync(path.join(blogsMetaPath, file)).toString()
            const metadata = YAML.parse(fileContent);
            metadata.date = moment(metadata.date);
            return metadata;
        })
        .sort((a, b) => b.date - a.date);

    // set the blog list in the cache
    client.set('blog_list', blogList, 0);

    // generate links to the previous and next blog
    const blogMap = blogList.reduce((map, blog, index) => {
        const metadata = {
            next: undefined,
            previous: undefined
        }

        if (index > 0) {
            metadata.previous = blogList[index-1];
        }

        if (index < blogList.length) {
            metadata.next = blogList[index+1];
        }

        map[blog.link] = { ...blog, metadata };
        return map;
    }, {});

    // set the blog map in the cache
    client.set('blog_map', blogMap, 0);

    // generate Fuse search index
    const fuse = new Fuse(blogList, {
        useExtendedSearch: true,
        keys: [
            "title",
            "subtitle",
            "description",
            "link",
            "tags"
        ]
    });

    // set the Fuse search index in the cache
    client.set('blog_search', fuse, 0);

    // load related blogs
    const related = JSON.parse(fs.readFileSync(relatedPath));
    
    // set the related blogs in the cache
    client.set('blog_related', related, 0);
}

function initialize() {
    loadBlogs();
}

module.exports = {
    initialize,
    client
}