const logger = require('winston');
const blogService = require('../../services/blogs');

async function search(req, res, next) {
    try {
        const { search } = req.query;

        const blogs = blogService.searchBlogs(search);

        return res.send(blogs);
    } catch (err) {
        logger.error('error searching blogs', err);
        return res.status(500).end();
    }
}


module.exports = [
    search
];