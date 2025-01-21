const  blogServiec  = require("./blog.service");


// Create db
exports.createBlog = async (req, res) => {
  try {
    const newBlog = await blogServiec.createBlogDb(req.body);
    if (!newBlog) return res.status(404).json({ message: 'Service not found' });
    res.json(newBlog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// Get service by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await blogServiec.getBlogByIdDb(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Service not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
// Get service by ID
exports.getAllBlogs = async (req, res) => {
  try {
    const blog = await blogServiec.getAllBlogsDb(req.query);
    if (!blog) return res.status(404).json({ message: 'Service not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Add a comment
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, content } = req.body;
    const commnetData = { name, email, content };

    const blog = await blogServiec.addCommentToServiceDb({id,commnetData});
    res.status(201).json({ message: 'Comment added successfully', blog });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
