import { checkSchema } from 'express-validator';

const findByIdValidation = checkSchema({
  id: {
    in: ['params'],
    trim: true,
    notEmpty: {
      errorMessage: 'Id is required.',
      options: { ignore_whitespace: true },
    },
  },
});

export default findByIdValidation;
