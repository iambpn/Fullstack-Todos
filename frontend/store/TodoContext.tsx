import React, { createContext, useContext, useEffect, useState } from 'react';
import { FetchContext } from './FetchContext';

export type ITodoProps = {
  children: React.ReactNode;
};

export type Todo = {
  _id: string;
  title: string;
  description: string;
  created_by: string;
  isError?: boolean;
};

export type ITodoContext = {
  fetchTodos(): Promise<void>;
  todos: Todo[];
  addTodo(data: Todo): void;
  selectedItem: string | undefined;
  setSelectedItem(data: string | undefined): void;
  updateTodo(data: Todo): void;
  deleteTodo(data: Todo): void;
};
export const TodoContext = createContext<ITodoContext>({
  selectedItem: undefined,
  setSelectedItem(data: string | undefined): void {},
  todos: [],
  addTodo(data: Todo) {},
  updateTodo(data: Todo) {},
  deleteTodo(data: Todo) {},
  async fetchTodos() {},
});

export function TodoProvider({ children }: ITodoProps): JSX.Element {
  const fetch = useContext(FetchContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<string | undefined>(
    undefined
  );

  async function fetchTodos() {
    try {
      let res = await fetch?.authAxios.get<{ msg: string; data: Todo[] }>(
        '/todo'
      );
      if (!res) {
        throw new Error('Response is undefined.');
      }
      setTodos(res.data.data);
    } catch (e) {
      console.log(e);
      setTodos([
        {
          isError: true,
          _id: 'Error',
          title: 'Something went wrong.',
          description: 'Something went wrong while fetching todos.',
          created_by: 'Something went wrong.',
        },
      ]);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = (data: Todo) => {
    setTodos([...todos, data]);
  };

  const updateTodo = (data: Todo) => {
    let tmp = todos.map((todo) => (todo._id !== data._id ? todo : data));
    setTodos([...tmp]);
  };

  const deleteTodo = (data: Todo) => {
    let tmp = todos.filter((todo) => todo._id !== data._id);
    setTodos([...tmp]);
  };

  const setSelectedItem = (id: string | undefined) => {
    setSelectedTodo(id);
  };

  const context: ITodoContext = {
    todos: todos,
    addTodo,
    selectedItem: selectedTodo,
    setSelectedItem,
    updateTodo,
    deleteTodo,
    fetchTodos,
  };
  return (
    <TodoContext.Provider value={context}>{children}</TodoContext.Provider>
  );
}
