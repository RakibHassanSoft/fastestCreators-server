const Blog = require("./blog.model");

// Fetch service details by ID
const getBlogByIdDb = async (id) => {
  return await Blog.findById(id);
};
const getAllBlogsDb =  async (payload) => {
  const { search, category, tags, page = 1, limit = 5, sortBy = 'date' }  = payload;


  // Building the query filters
  let query = {};

 // Assuming `search` is the query parameter you are using for searching
if (search) {
  query['$or'] = [
    { headTitle: { $regex: search, $options: 'i' } },
    { summary: { $regex: search, $options: 'i' } },
    { 'contents.data': { $regex: search, $options: 'i' } } // Search within contents
  ];
}


  if (category) {
    query['category'] = category; // Category filter
  }

  if (tags) {
    query['tags'] = { $in: tags.split(',') }; // Tags filter (split by comma)
  }

  // Sorting options
  const sortOptions = {
    [sortBy]: 1 // Default ascending order
  };

  // Pagination
  const skip = (page - 1) * limit;

  try {
    const blogs = await Blog.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sortOptions);

    // Count total blogs for pagination
    const totalBlogs = await Blog.countDocuments(query);

    return {
      blogs,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalBlogs / limit),
        totalBlogs
      }
    }
  } catch (error) {
    return error
  }
};

// Create a new blog
const createBlogDb = async (payload) => {
  const newBlog = new Blog(payload); // Create a new Blog instance with the provided payload
  return await newBlog.save(); // Save the instance to the database
};

// Add a comment to a service
const addCommentToServiceDb = async (payload) => {
  const { id, commentData } = payload;
  const blog = await Blog.findById(id);
  if (!blog) throw new Error('Service not found'); // Error handling if blog is not found

  blog.comments.push(commentData); // Add the comment to the blog's comments array
  await blog.save(); // Save the updated blog with the new comment
  return blog;
};

module.exports = { getBlogByIdDb, createBlogDb, addCommentToServiceDb ,getAllBlogsDb};
