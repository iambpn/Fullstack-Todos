import { checkSchema } from 'express-validator';

const registerValidator = checkSchema({
  username: {
    in: ['body'],
    trim: true,
    notEmpty: {
      errorMessage: 'Username is empty',
      options: { ignore_whitespace: true },
    },
    isEmail: {
      errorMessage: 'Username is not a valid email',
    },
  },
  confirm_password: {
    in: ['body'],
    isLength: {
      errorMessage: 'Confirm Password length must be greater then 8.',
      options: { min: 8 },
    },
  },
  password: {
    in: ['body'],
    isLength: {
      errorMessage: 'Password length must be greater then 8.',
      options: { min: 8 },
    },
    custom: {
      options: (value, { req, location, path }) => {
        return value === req.body.confirm_password;
      },
      errorMessage: 'Confirm password does not match password',
    },
  },
  name: {
    in: ['body'],
    trim: true,
    notEmpty: {
      errorMessage: 'Name must not be empty',
      options: { ignore_whitespace: true },
    },
  },
  phone_number: {
    in: ['body'],
    isLength: {
      options: { min: 10, max: 10 },
      errorMessage: 'Phone number must be of 10 digit.',
      bail: true,
    },
    toInt: true,
    isInt: {
      errorMessage: 'Phone number must be a number',
    },
  },
});

export default registerValidator;
