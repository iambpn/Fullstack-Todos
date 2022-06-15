import { checkSchema } from 'express-validator';

const pagination = checkSchema({
  page: {
    in: ['query'],
    trim: true,
    toInt: true,
  },
  limit: {
    in: ['query'],
    trim: true,
    toInt: true,
  },
});

export default pagination;
