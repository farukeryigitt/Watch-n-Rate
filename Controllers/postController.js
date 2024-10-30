const { createpostSchema } = require('../Middlewares/validator');
const Post = require('../Models/postModel.js');

exports.createpost = async (req, res) => {
  const { link, description } = req.body;
  const { userId } = req.user;
  try {
    const { error, value } = createpostSchema.validate({ link, description });
    if (error) {
      return res
        .status(401)
        .json({ succes: false, message: error.details[0].message });
    }
    const data = await Post.create({ link, description, author: userId });
    return res.status(201).json({ succes: true, data });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        success: false,
        message: 'An error occurred while fetching comments.',
      });
  }
};

exports.deletepost = async (req, res) => {
  const { _id } = req.params;
  const { userId } = req.user;
  try {
    if (!_id) {
      return res.status(404).json({ message: 'That post seems unavailable!' });
    }
    const post = await Post.findOne({ _id });
    if (!post) {
      return res
        .status(404)
        .json({ message: 'Oops! That post seems already unavailable!' });
    }
    if (post.author.toString() !== userId) {
      return res.status(400).json({
        message: 'You do not have the authority to delete this post!',
      });
    }

    await Post.deleteOne({ _id });
    return res
      .status(203)
      .json({ success: true, message: 'Post deleted succesfully!' });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        success: false,
        message: 'An error occurred while fetching comments.',
      });
  }
};
exports.getallpost = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching posts.',
    });
  }
};
exports.getonepost = async (req, res) => {
  const { _id } = req.params;
  try {
    if (!_id) {
      return res.status(404).json({ message: 'That post seems unavailable!' });
    }
    const post = await Post.findOne({ _id }).populate('author', 'username');
    if (!post) {
      return res
        .status(404)
        .json({ message: 'Oops! That post seems already unavailable!' });
    }
    return res.status(200).json({ succes: true, post });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        success: false,
        message: 'An error occurred while fetching comments.',
      });
  }
};
exports.updatepost = async (req, res) => {
  const { _id } = req.params;
  const { userId } = req.user;
  const { description, link } = req.body;
  try {
    const { error, value } = createpostSchema.validate({ description, link });
    if (error) {
      return res
        .status(401)
        .json({ succes: false, message: error.details[0].message });
    }

    if (!_id) {
      return res.status(404).json({ message: 'That post seems unavailable!' });
    }
    const post = await Post.findOne({ _id });
    if (!post) {
      return res
        .status(404)
        .json({ message: 'Oops! That post seems already unavailable!' });
    }
    if (post.author.toString() !== userId) {
      return res.status(400).json({
        message: 'You do not have the authority to delete this post!',
      });
    }
    post.link = link;
    post.description = description;
    await post.save();
    return res.status(201).json({
      succes: true,
      message: 'Your post has been changed succesfully',
      post,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        success: false,
        message: 'An error occurred while fetching comments.',
      });
  }
};
