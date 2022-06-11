import Link from 'next/link';
import * as yup from 'yup';
import ReqErrorResolver from '../hooks/ReqErrorResolver';
import { useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FetchContext } from '../../store/FetchContext';
import { Todo, TodoContext } from '../../store/TodoContext';

type FormResponse = {
  msg: string;
  todo: Todo;
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

  const onSubmitHandler: SubmitHandler<IFormData> = async (data) => {
    try {
      let res = await fetch?.authAxios.post<FormResponse>('/todo', {
        title: data.title,
        description: data.description,
      });
      if (!res) {
        console.log('Response is undefined.');
        throw new Error('Response is undefined.');
      }
      todoCtx.addTodo(res.data.todo);
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
      <div className={'flex justify-end w-2/3'}>
        <input
          type='button'
          value='Clear'
          className={
            'rounded h-[35px] bg-red-400 border-red-400 text-[16px] text-white w-[100px] ml-2'
          }
          disabled={isSubmitting}
        />
        <input
          type='submit'
          value='Add'
          className={
            'rounded h-[35px] bg-green-400 border-green-400 text-[16px] text-white mb-2 w-[100px] ml-2'
          }
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
}
