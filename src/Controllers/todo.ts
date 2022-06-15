import { Request, Response } from 'express';
import Todo from '../Models/todo';
import { validationResult } from 'express-validator';

async function findAll(
  req: Request<{}, {}, {}, { page: number; limit: number }>,
  res: Response
) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }

    const query = req.query;
    if (isNaN(query.page) || query.page <= 0) {
      query.page = 1;
    }

    if (isNaN(query.limit) || query.limit <= 0) {
      query.limit = 10;
    }

    let todos = await Todo.find()
      .skip((query.page - 1) * query.limit)
      .limit(query.limit)
      .exec();
    res.status(200).json({ msg: 'success', data: todos });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      errors: {
        type: 'server',
        msg: 'Something went wrong.',
      },
    });
  }
}

async function findById(req: Request<{ id: string }>, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }

    const id = req.params.id;
    let todo = await Todo.find({ _id: id }).exec();
    res.status(200).json({ msg: 'success', data: todo });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      errors: {
        type: 'server',
        msg: 'Something went wrong.',
      },
    });
  }
}

async function create(
  req: Request<{}, {}, { title: string; description: string }>,
  res: Response
) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }

    const body = req.body;
    let todo = await Todo.create({
      title: body.title,
      description: body.description,
      created_by: req.userId,
    });
    return res.status(201).json({ msg: 'success', data: todo });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      errors: {
        type: 'server',
        msg: 'Something went wrong.',
      },
    });
  }
}

async function update(
  req: Request<{ id: string }, {}, { title: string; description: string }>,
  res: Response
) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }

    const id = req.params.id;
    const body = req.body;

    let todo = await Todo.findByIdAndUpdate({ _id: id }, body, {
      new: true,
    }).exec();

    if (!todo) {
      res.status(404).json({
        errors: {
          type: 'server',
          msg: 'Id not found.',
        },
      });
    }

    return res.status(200).json({
      msg: 'success',
      data: todo,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      errors: {
        type: 'server',
        msg: 'Something went wrong.',
      },
    });
  }
}

async function remove(req: Request<{ id: string }>, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }

    const id = req.params.id;
    let todo = await Todo.findByIdAndRemove({ _id: id }).exec();
    console.log(todo);
    if (!todo) {
      res.status(404).json({
        errors: {
          type: 'server',
          msg: 'Id not found.',
        },
      });
    }
    res.status(200).json({
      msg: 'success',
      data: todo,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      errors: {
        type: 'server',
        msg: 'Something went wrong.',
      },
    });
  }
}

export { findAll, findById, update, remove, create };
