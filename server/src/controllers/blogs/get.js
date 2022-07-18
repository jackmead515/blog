
const blogService = require('../../services/blogs');
const dbService = require('../../services/db');

async function get(req, res, next) {
    try {
        const { id } = req.params;
        const blog = blogService.getBlog(id);

        res.json(blog);

        return next();
    } catch (err) {
        console.error('failed to get blog', err);
        return res.status(500).end();
    }
}

async function updateViews(req) {
    try {
        const { id } = req.params;

        const timestamp = new Date().getTime();
        await dbService.updateStats(id, timestamp);

    } catch (err) {
        console.error('failed to update views on blog', err);
    }
}


module.exports = [
    get,
    updateViews
];