import mongoose, { Model, Types } from 'mongoose';

export interface ITodo {
  title: string;
  description: string;
  created_by: Types.ObjectId;
}

export interface InstanceMethods {}

export interface TodoModel extends Model<ITodo, {}, InstanceMethods> {}

const userSchema = new mongoose.Schema<ITodo, TodoModel, InstanceMethods>({
  title: { type: 'string', required: true },
  description: { type: 'string', required: true },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

const Todo = mongoose.model<ITodo, TodoModel, InstanceMethods>(
  'Todo',
  userSchema
);
export default Todo;
