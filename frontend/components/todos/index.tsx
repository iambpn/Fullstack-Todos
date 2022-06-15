import Link from 'next/link';
import * as yup from 'yup';
import ReqErrorResolver from '../hooks/ReqErrorResolver';
import React, { useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FetchContext } from '../../store/FetchContext';
import { Todo, TodoContext } from '../../store/TodoContext';

type FormResponse = {
  msg: string;
  data: Todo;
};

// schema validation
const schema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
});

type IFormData = yup.InferType<typeof schema>;

export default function Todos(): JSX.Element {
  const fetch = useContext(FetchContext);
  const todoCtx = useContext(TodoContext);

  const { resolver: errResolver } = ReqErrorResolver();
  const [serverErr, setServerErr] = useState('');

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
    setValue,
  } = useForm<IFormData>({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (serverErr !== '') {
      setTimeout(() => {
        setServerErr('');
      }, 8000);
    }
  }, [serverErr]);

  useEffect(() => {
    const selectedTodo = !todoCtx.selectedItem
      ? undefined
      : todoCtx.todos.find((todo) => todo._id === todoCtx.selectedItem);
    setValue('title', selectedTodo ? selectedTodo.title : '');
    setValue('description', selectedTodo ? selectedTodo.description : '');
  }, [todoCtx.selectedItem]);

  const onSubmitHandler: SubmitHandler<IFormData> = async (data) => {
    try {
      if (!todoCtx.selectedItem) {
        let res = await fetch?.authAxios.post<FormResponse>('/todo', {
          title: data.title,
          description: data.description,
        });
        if (!res) {
          throw new Error('Response is undefined.');
        }
        todoCtx.addTodo(res.data.data);
      } else {
        let res = await fetch?.authAxios.put<FormResponse>(
          `/todo/${todoCtx.selectedItem}`,
          {
            title: data.title,
            description: data.description,
          }
        );
        if (!res) {
          throw new Error('Response is undefined.');
        }
        todoCtx.updateTodo(res.data.data);
      }
      // clean up
      todoCtx.setSelectedItem(undefined);
      setValue('title', '');
      setValue('description', '');
    } catch (e: any) {
      let errors = errResolver(e, ['username', 'passwords']);
      if (errors.type === 'client') {
        errors.error.forEach(({ name, msg }) => {
          setError(name as any, { message: msg }, { shouldFocus: true });
        });
      } else {
        setServerErr(errors.error);
      }
    }
  };

  const onDeleteHandler = async (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    try {
      let res = await fetch?.authAxios.delete<FormResponse>(
        `/todo/${todoCtx.selectedItem}`
      );
      if (!res) {
        throw new Error('Response is undefined.');
      }
      todoCtx.deleteTodo(res.data.data);

      //clean up
      todoCtx.setSelectedItem(undefined);
      setValue('title', '');
      setValue('description', '');
    } catch (e: any) {
      console.log(e.response);
      setServerErr('Error while deleting.');
    }
  };

  return (
    <form
      className={'flex flex-col items-center h-full pt-[50px]'}
      onSubmit={handleSubmit(onSubmitHandler)}
    >
      {serverErr !== '' && (
        <span className={'text-[16px] text-center text-red-500 block mb-3'}>
          {serverErr}
        </span>
      )}
      <div className={'flex flex-col w-2/3 mb-3'}>
        <label htmlFor='name' className={'w-full'}>
          Title
        </label>
        <input
          type='text'
          id={'name'}
          className={'w-full h-[30px] pl-1'}
          {...register('title')}
        />
        <span className={'text-[12px] text-right text-red-500'}>
          {errors.title?.message}
        </span>
      </div>
      <div className={'flex flex-col w-2/3 mb-2'}>
        <label htmlFor='note' className={'w-full'}>
          Description
        </label>
        <textarea
          id={'note'}
          className={'w-full resize-none h-[200px] text-[14px] p-1'}
          {...register('description')}
        ></textarea>
        <span className={'text-[12px] text-right text-red-500'}>
          {errors.description?.message}
        </span>
      </div>
      <div className={'flex justify-between w-2/3'}>
        <div>
          {todoCtx.selectedItem && (
            <input
              type='button'
              value={'Delete'}
              className={
                'rounded h-[35px] bg-red-400 border-red-400 text-[16px] text-white mb-2 w-[100px] ml-2'
              }
              disabled={isSubmitting}
              onClick={onDeleteHandler}
            />
          )}
        </div>
        <div className={'justify-end'}>
          <input
            type='button'
            value='Clear'
            className={
              'rounded h-[35px] bg-red-400 border-red-400 text-[16px] text-white w-[100px] ml-2'
            }
            disabled={isSubmitting}
            onClick={() => {
              todoCtx.setSelectedItem(undefined);
            }}
          />
          <input
            type='submit'
            value={todoCtx.selectedItem ? 'Save' : 'Add'}
            className={
              'rounded h-[35px] bg-green-400 border-green-400 text-[16px] text-white mb-2 w-[100px] ml-2'
            }
            disabled={isSubmitting}
          />
        </div>
      </div>
    </form>
  );
}
