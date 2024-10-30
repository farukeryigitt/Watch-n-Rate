const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
  {
    link: {
      type: String,
      required: [true, 'Your video link is required!'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Your video link is required!'],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required!'],
    },
  },
  { timestamps: true },
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
