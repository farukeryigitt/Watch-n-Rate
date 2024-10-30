const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required!'],
      trim: true,
      unique: [true, 'Email must be unique!'],
      minLength: [5, 'Email must be minimum 5 characters!'],
      lowercase: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required!'],
      trim: true,
      unique: [true, 'Username must be unique!'],
      minLength: [2, 'Username must be minimum 2 characters!'],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required!'],
      trim: true,
      select: false,
    },
    forgotPasswordCode: {
      type: String,
      select: false,
    },
    forgotPasswordCodeValidation: {
      type: Number,
      select: false,
    },
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);

module.exports = User;
