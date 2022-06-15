import { Router } from 'express';
import { create, findAll, findById, remove, update } from '../Controllers/todo';
import paginationValidation from '../Validators/todo/pagination';
import findByIdValidation from '../Validators/todo/findById';
import createTodo from '../Validators/todo/createTodo';
import createTodoValidation from '../Validators/todo/createTodo';

const todo_router = Router();

todo_router.get('/:id', findByIdValidation, findById);

todo_router.get('/', paginationValidation, findAll);

todo_router.post('/', createTodoValidation, create);

todo_router.put('/:id', findByIdValidation, createTodoValidation, update);

todo_router.delete('/:id', findByIdValidation, remove);

export default todo_router;
