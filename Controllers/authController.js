const jwt = require('jsonwebtoken');
const {
  signupSchema,
  signinSchema,
  changepasswordSchema,
  verifyforgotpasswordSchema,
} = require('../Middlewares/validator.js');
const User = require('../Models/userModel.js');
const { dohash, comparehash, hmac } = require('../Utils/hash.js');
const transport = require('../Middlewares/mail.js');
require('dotenv').config();

exports.signup = async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const { error, value } = signupSchema.validate({
      email,
      password,
      username,
    });
    if (error) {
      return res
        .status(401)
        .json({ succes: false, message: error.details[0].message });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(401)
        .json({ succes: false, message: 'user already exists' });
    }
    const hashedPassword = await dohash(password, 12);
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });
    const result = await newUser.save();
    result.password = undefined;
    res.status(201).json({ succes: true, message: 'User created.', result });
  } catch (error) {
    console.log(error);
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = signinSchema.validate({ email, password });
    if (error) {
      return res
        .status(401)
        .json({ succes: false, message: error.details[0].message });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res
        .status(401)
        .json({ succes: false, message: 'User does not exist!' });
    }
    const result = await comparehash(password, user.password);
    if (!result) {
      return res
        .status(401)
        .json({ succes: false, message: 'Invalid password!' });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_KEY,
      {
        expiresIn: '8h',
      },
    );
    res
      .cookie('Authorization', 'Bearer ' + token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
      })
      .json({ succes: true, message: 'logged in succesfully', token: token });
  } catch (error) {
    console.log(error);
  }
};

exports.signout = async (req, res) => {
  res
    .clearCookie('Authorization')
    .status(200)
    .json({ succes: true, message: 'you logged out succuesfully' });
};

exports.changepassword = async (req, res) => {
  const { userId } = req.user;
  const { oldPassword, newPassword } = req.body;
  try {
    const { error, value } = changepasswordSchema.validate({
      oldPassword,
      newPassword,
    });
    if (error) {
      return res
        .status(401)
        .json({ succes: false, message: error.details[0].message });
    }
    const user = await User.findOne({ _id: userId }).select('+password');
    if (!user) {
      return res
        .status(401)
        .json({ succes: false, message: 'user does not exist.' });
    }
    const result = await comparehash(oldPassword, user.password);
    if (!result) {
      return res
        .status(401)
        .json({ succes: false, message: 'Invalid password.' });
    }
    const hashedPassword = await dohash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({
      succes: true,
      message: 'your password changed.',
    });
  } catch (error) {
    
  }
};

exports.sendforgotcode = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ succes: false, message: 'user does not exist.' });
    }
    const codeValue = Math.floor(Math.random() * 1000000).toString();
    let mailinfo = await transport.sendMail({
      from: process.env.SENDING_EMAIL,
      to: user.email,
      subject: 'Forgot Password Code',
      html: '<h1>' + codeValue + '</h1>',
    });
    if (mailinfo.accepted[0] === user.email) {
      const hmaccodeValue = hmac(codeValue, process.env.HMAC_KEY);
      user.forgotPasswordCode = hmaccodeValue;
      user.forgotPasswordCodeValidation = Date.now();
      await user.save();
      return res
        .status(200)
        .json({ succes: true, message: 'Your code for new password sent!' });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.verifyforgotpasswordcode = async (req, res) => {
  const { email, providedCode, newPassword } = req.body;
  try {
    const { error, value } = verifyforgotpasswordSchema.validate({
      email,
      providedCode,
      newPassword,
    });
    if (error) {
      return res
        .status(401)
        .json({ succes: false, message: error.details[0].message });
    }
    const codeValue = providedCode.toString();
    const user = await User.findOne({ email }).select(
      '+forgotPasswordCode +forgotPasswordCodeValidation',
    );
    if (!user) {
      return res
        .status(401)
        .json({ succes: false, message: 'user does not exist.' });
    }
    if (!user.forgotPasswordCode || !user.forgotPasswordCodeValidation) {
      return res
        .status(400)
        .json({ succes: false, message: 'something is wrong with the code' });
    }
    if (Date.now() - user.forgotPasswordCodeValidation > 5 * 60 * 1000) {
      return res
        .status(400)
        .json({ succes: false, message: 'code has been expired' });
    }

    const hmacCodeValue = hmac(codeValue, process.env.HMAC_KEY);
    if (hmacCodeValue !== user.forgotPasswordCode) {
      return res
        .status(400)
        .json({ success: false, message: 'Your HMAC code is wrong.' });
    }

    if (hmacCodeValue == user.forgotPasswordCode) {
      const hashednewPasword = await dohash(newPassword, 12);
      user.password = hashednewPasword;
      user.forgotPasswordCode = undefined;
      user.forgotPasswordCodeValidation = undefined;

      await user.save();
      return res
        .status(200)
        .json({ succes: true, message: 'changed your password succesfully' });
    }
  } catch (error) {
    console.log(error);
  }
};
