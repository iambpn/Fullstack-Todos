import UserModel, { IUser } from '../Models/user';
import TodoModel, { ITodo } from '../Models/todo';

export default async function seedTodo() {
  let todoData: Partial<ITodo> = {
    description: 'Seeded Description',
    title: 'Seeded Title',
  };

  let user = await UserModel.findOne({ email: 'admin@gmail.com' }).exec();
  if (!user) {
    throw new Error('Seed User not found.');
  }

  let todo = await TodoModel.findOne({ created_by: user.id }).exec();
  if (!todo) {
    todoData.created_by = user.id;
    todo = new TodoModel(todoData);
    await todo.save();
  }
}
