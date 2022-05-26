import { checkSchema } from 'express-validator';

const forgotPasswordValidator = checkSchema({
  answer: {
    in: ['body'],
    trim: true,
    isLength: {
      options: { min: 10, max: 200 },
      errorMessage: 'Answer should be more with in 10-200 chars.',
    },
  },
  confirm_password: {
    in: ['body'],
    isLength: {
      errorMessage: 'Confirm Password length must be greater then 8.',
      options: { min: 8 },
    },
  },
  new_password: {
    in: ['body'],
    isLength: {
      errorMessage: 'Password length must be greater then 8.',
      options: { min: 8 },
    },
    custom: {
      options: (value, { req, location, path }) => {
        return value === req.body.confirm_password;
      },
      errorMessage: 'Confirm password does not match New Password',
    },
  },
});

export default forgotPasswordValidator;
