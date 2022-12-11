module.exports = function(defaultPageSize=10, maxPageSize=100) {
    return (req, res, next) => {
      const { page, pageSize } = req.query;
  
      const parsedPageSize = parseInt(pageSize);
      const parsedPage = parseInt(page);
  
      req.pagination = {
        pageSize: defaultPageSize,
        page: 1,
        skip: 0,
      };
  
      if (parsedPageSize && parsedPageSize <= maxPageSize && parsedPageSize >= 0) {
        req.pagination.pageSize = parsedPageSize;
      }
  
      if (parsedPage && parsedPage >= 1) {
        req.pagination.page = parsedPage;
      }
  
      req.pagination.skip = (req.pagination.page - 1) * req.pagination.pageSize;
  
      return next();
    };
  };