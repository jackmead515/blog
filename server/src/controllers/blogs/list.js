const pagination = require("@middleware/pagination");

const blogService = require('../../services/blogs');


async function list(req, res, next) {
    const blogList = blogService.getBlogList();
    return res.json(blogList);
}


module.exports = [
    pagination(),
    list
];