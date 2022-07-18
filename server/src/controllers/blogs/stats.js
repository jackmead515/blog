const logger = require('winston');
const blogService = require('../../services/blogs');
const dbService = require('../../services/db');

async function stats(req, res, next) {
    try {
        const { id } = req.params;

        if (!blogService.blogExists(id)) {
            return res.status(404).end();
        }

        const stats = await dbService.getStats(id);

        return res.send(stats);

    } catch (err) {
        logger.error('error searching blogs', err);
        return res.status(500).end();
    }
}

module.exports = [
    stats
];