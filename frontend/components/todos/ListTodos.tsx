import { useContext } from 'react';
import { TodoContext } from '../../store/TodoContext';

export default function ListTodos(): JSX.Element {
  const todoContext = useContext(TodoContext);
  return (
    <div>
      {todoContext.todos.map((todo) => (
        <div
          key={todo._id}
          className={
            'border border-solid border-white px-3 py-2 capitalize hover:bg-white hover:text-black hover:cursor-pointer'
          }
          onClick={() => {
            todoContext.setSelectedItem(todo._id);
          }}
        >
          <div className={'text-[18px]'}>{todo.title}</div>
          <div
            className={
              'text-[14px] pl-4 overflow-ellipsis overflow-hidden whitespace-nowrap'
            }
          >
            {todo.description}{' '}
          </div>
        </div>
      ))}
    </div>
  );
}
