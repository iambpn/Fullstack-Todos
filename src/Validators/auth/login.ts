import { checkSchema } from 'express-validator';

const loginValidator = checkSchema({
  username: {
    in: ['body'],
    trim: true,
    notEmpty: {
      errorMessage: 'Username is empty.',
      options: { ignore_whitespace: true },
    },
  },
  password: {
    in: ['body'],
    isLength: {
      errorMessage: 'Password length must be greater then 8.',
      options: { min: 8 },
    },
  },
});

export default loginValidator;
