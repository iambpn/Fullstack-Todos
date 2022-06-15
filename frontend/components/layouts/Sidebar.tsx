import ListTodos from '../todos/ListTodos';
import { useContext } from 'react';
import { TodoContext } from '../../store/TodoContext';
import { useRouter } from 'next/router';

export default function Sidebar() {
  const todoContext = useContext(TodoContext);
  return (
    <>
      <div className={'border border-solid w-full h-full'}>
        <div className={'text-right'}>
          <button
            className={
              'rounded h-[35px] bg-green-400 border-green-400 text-[16px] text-white w-[100px] mx-2 my-2'
            }
            onClick={() => {
              todoContext.setSelectedItem(undefined);
            }}
          >
            Add TODO
          </button>
        </div>
        <ListTodos />
      </div>
    </>
  );
}
