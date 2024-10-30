const Joi = require('joi');

exports.signupSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({ tlds: { allow: ['com', 'net'] } }),
  password: Joi.string()
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,}$'))
    .message(
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, and be at least 8 characters long.',
    ),
  username: Joi.string().min(3).max(12).required(),
});

exports.signinSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({ tlds: { allow: ['com', 'net'] } }),
  password: Joi.string()
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,}$'))
    .message(
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, and be at least 8 characters long.',
    ),
});

exports.changepasswordSchema = Joi.object({
  newPassword: Joi.string()
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,}$'))
    .message(
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, and be at least 8 characters long.',
    ),
  oldPassword: Joi.string()
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,}$'))
    .message(
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, and be at least 8 characters long.',
    ),
});

exports.verifyforgotpasswordSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({ tlds: { allow: ['com', 'net'] } }),
  newPassword: Joi.string()
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,}$'))
    .message(
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, and be at least 8 characters long.',
    ),
  providedCode: Joi.number().required(),
});

exports.createpostSchema = Joi.object({
  link: Joi.string().required().uri().max(100).messages({
    'string.base': 'Link must be a string!',
    'string.empty': 'Link cannot be empty!',
    'string.uri': 'Please enter a valid URL!',
    'any.required': 'Link is required!',
  }),
  description: Joi.string()
    .required()
    .min(5) // Minimum 5 karakter
    .max(500) // Maximum 500 karakter
    .messages({
      'string.base': 'Description must be a string!',
      'string.empty': 'Description cannot be empty!',
      'string.min': 'Description must be at least 5 characters long!',
      'string.max': 'Description must not exceed 500 characters!',
      'any.required': 'Description is required!',
    }),
});

exports.createcommentSchema = Joi.object({
  comment: Joi.string()
    .required()
    .min(5) // Minimum 5 karakter
    .max(500) // Maximum 500 karakter
    .messages({
      'string.base': 'comment  must be a string!',
      'string.empty': 'comment  cannot be empty!',
      'string.min': 'comment  must be at least 5 characters long!',
      'string.max': 'comment  must not exceed 500 characters!',
      'any.required': 'comment  is required!',
    }),
});
