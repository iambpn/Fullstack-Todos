import { Router } from 'express';

const todo_router = Router();

//todo: implement methods
todo_router.get('/', () => {
  console.log('get');
});
todo_router.post('/', () => {
  console.log('post');
});
todo_router.put('/', () => {
  console.log('put');
});
todo_router.delete('/', () => {
  console.log('delete');
});

export default todo_router;
