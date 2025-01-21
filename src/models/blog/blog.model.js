const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    match: [/.+\@.+\..+/, 'Please enter a valid email address']
  },
  content: { type: String, required: true },
});

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
});

const blogSchema = new mongoose.Schema({
  HeadTitle: { type: String, required: true },
  headContent: { type: String, required: true },
  headImage: { type: String, required: true },
  Highlight: { type: String },
  date: { type: Date, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['web_development', 'logo_design', 'app_development', 'video_editing', 'logo_animation']
  },
  tags: { 
    type: [String], 
    default: [] 
  },
  contents: [contentSchema],
  comments: { type: [commentSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
