const { createcommentSchema } = require('../Middlewares/validator.js');
const Comment = require('../Models/commentModel.js');

exports.createcomment = async (req, res) => {
  const { comment } = req.body;
  const { post_id } = req.params;
  const { userId } = req.user;
  try {
    const { error, value } = createcommentSchema.validate({ comment });
    if (error) {
      return res.status(401).json({
        succes: false,
        message: error.details[0].message,
      });
    }
    if (!post_id) {
      return res
        .status(404)
        .json({ message: "It seems the post doesn't exist!" });
    }
    const createdComment = await Comment.create({
      comment,
      author: userId,
      commentedpost: post_id,
    });
    res
      .status(201)
      .json({ succes: true, message: 'Your comment created!', createdComment });
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

exports.deletecomment = async (req, res) => {
  const { _id } = req.params;
  const { userId } = req.user;
  try {
    if (!_id) {
      return res
        .status(404)
        .json({ message: "It seems the post doesn't exist!" });
    }
    const comment = await Comment.findOne({ _id });
    if (!comment) {
      return res
        .status(404)
        .json({ message: "It seems the comment doesn't exist!" });
    }
    if (comment.author.toString() !== userId) {
      return res.status(400).json({
        message: 'You dont have the authority to delete this comment',
      });
    }
    await Comment.deleteOne({ _id });
    res
      .status(203)
      .json({ success: true, message: 'Comment deleted succesfully!' });
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
exports.getpostcomments = async (req, res) => {
  const { post_id } = req.params;
  try {
    const comments = await Comment.find({ commentedpost: post_id })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.status(200).json({ succes: true, comments });
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

exports.getonecomment = async (req, res) => {
  const { _id } = req.params;
  try {
    const comment = await Comment.findOne({ _id })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.status(200).json({ succes: true, comment });
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
