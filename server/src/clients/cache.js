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
    const blogList = fs.readdirSync(blogsMetaPath)
        .map(file => {
            const fileContent = fs.readFileSync(path.join(blogsMetaPath, file)).toString()
            const metadata = YAML.parse(fileContent);
            metadata.date = moment(metadata.date);
            return metadata;
        })
        .sort((a, b) => b.date - a.date);

    client.set('blog_list', blogList, 0);

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

    client.set('blog_map', blogMap, 0);

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

    client.set('blog_search', fuse, 0);

    const related = JSON.parse(fs.readFileSync(relatedPath));
    
    client.set('blog_related', related, 0);
}

function initialize() {
    loadBlogs();
}

module.exports = {
    initialize,
    client
}