const express = require('express');
const { addComment, createBlog, getBlogById, getAllBlogs } = require('./blog.controller');

// Create a new router instance
const blogRouter = express.Router();

// Route to create a blog
blogRouter.post('/create-blog', createBlog);

// Route to get all blog details by ID
blogRouter.get('/get-all', getAllBlogs);
/*
http://localhost:3000/api/v1/blogs/get-all?category=web_development
http://localhost:3000/api/v1/blogs/get-all?tags=HTML
http://localhost:3000/api/v1/blogs/get-all?search=tandin
http://localhost:3000/api/v1/blogs/get-all?page=1&limit=2
*/
// Route to get service details by ID
blogRouter.get('/:id', getBlogById);

// Route to add a comment
blogRouter.post('/:id/comments', addComment);

module.exports = blogRouter;
