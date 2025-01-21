class DatabaseService {
    constructor(model) {
      this.model = model; 
    }
  
    async getAll(payload) {
      const { search, filters, limit, page, sortField, sortOrder } = payload;
  
      // Initialize the query object
      let query = {};
  
      // Search logic
      if (search) {
        query = {
          ...query,
          $or: [
            { headTitle: new RegExp(search, "i") }, 
            { summary: new RegExp(search, "i") },  
            { tags: { $in: [new RegExp(search, "i")] } }
          ],
        };
      }
  
      // Filters logic
      if (filters) {
        query = { ...query, ...filters }; 
      }
  
      // Pagination logic
      const itemsPerPage = parseInt(limit) || 10;
      const currentPage = parseInt(page) || 1;
  
      // Sorting logic
      const sortQuery = sortField
        ? { [sortField]: sortOrder === "desc" ? -1 : 1 }
        : { createdAt: -1 }; 
  
      // Execute the query
      const blogs = await this.model
        .find(query)
        .sort(sortQuery)
        .skip((currentPage - 1) * itemsPerPage)
        .limit(itemsPerPage);
  
      // Get the total count of matching documents
      const totalCount = await this.model.countDocuments(query);
      return { blogs, totalCount };
    }
  }
  
  module.exports = DatabaseService;
  