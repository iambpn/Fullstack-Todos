import React, { createContext, useContext, useEffect, useState } from 'react';
import { FetchContext } from './FetchContext';

export type ITodoProps = {
  children: React.ReactNode;
};

export type Todo = {
  title: string;
  description: string;
  isError?: boolean;
};

export type ITodoContext = {
  todos: Todo[];
  addTodo(data: Todo): void;
};
export const TodoContext = createContext<ITodoContext>({
  todos: [],
  addTodo(data: Todo) {},
});

export function TodoProvider({ children }: ITodoProps): JSX.Element {
  const fetch = useContext(FetchContext);
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    async function getTodos() {
      try {
        let res = await fetch?.authAxios.get<Todo[]>('/todo');
        if (!res) {
          console.log(res);
          throw new Error('Response is undefined.');
        }
        setTodos(res.data);
      } catch (e) {
        console.log(e);
        setTodos([
          {
            isError: true,
            title: 'Something went wrong.',
            description: 'Something went wrong while fetching todos.',
          },
        ]);
      }
    }

    getTodos();
  }, []);

  const addTodo = (data: Todo) => {
    setTodos([...todos, data]);
  };

  const context: ITodoContext = {
    todos: todos,
    addTodo,
  };
  return (
    <TodoContext.Provider value={context}>{children}</TodoContext.Provider>
  );
}
