function pagination(model) {
    return async (req, res, next) => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
  
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
  
      const results = {};
  
      try {
        results.results = await model.find().limit(limit).skip(startIndex).exec();
        results.totalPages = Math.ceil(await model.countDocuments().exec() / limit);
        res.paginatedResults = results;
        next();
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    };
  }
  
  module.exports = pagination;
  