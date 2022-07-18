const logger = require('winston');
const blogService = require('../../services/blogs');

async function tagged(req, res, next) {
    try {
        const { id } = req.params;

        const blogList = blogService.getBlogList();

        const blogs = blogList.filter(blog => {
            const { tags = [] } = blog;
            return tags.find(t => t.toLowerCase() === id);
        });

        return res.send(blogs);
    } catch (err) {
        logger.error('error searching blogs', err);
        return res.status(500).end();
    }
}


module.exports = [
    tagged
];