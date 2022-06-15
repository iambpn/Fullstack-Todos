import { checkSchema } from 'express-validator';

const createTodoValidation = checkSchema({
  title: {
    in: ['body'],
    trim: true,
    notEmpty: {
      errorMessage: 'Body is required.',
      options: { ignore_whitespace: true },
    },
  },
  description: {
    in: ['body'],
    trim: true,
    notEmpty: {
      errorMessage: 'Description is required.',
      options: { ignore_whitespace: true },
    },
  },
});

export default createTodoValidation;
