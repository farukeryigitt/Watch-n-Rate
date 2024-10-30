const mongoose = require('mongoose');

const commnentSchema = mongoose.Schema({
  comment: {
    type: String,
    required: [true, 'Your comment is required!'],
    trim: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required!'],
    index: true,
  },
  commentedpost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Commented post is required!'],
    index: true,
  },
});
const Comment = mongoose.model('Comment', commnentSchema);
module.exports = Comment;
