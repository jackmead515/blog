const logger = require('winston');
const blogService = require('../../services/blogs');

async function related(req, res, next) {
    try {
        const { id } = req.params;

        const blogs = blogService.getRelated(id);

        return res.send(blogs);
    } catch (err) {
        logger.error('error getting related blogs', err);
        return res.status(500).end();
    }
}


module.exports = [
    related
];