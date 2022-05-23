import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { FetchContext } from '../../store/FetchContext';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';

type IFormData = {
  username: string;
  password: string;
};

export default function LoginForm(): JSX.Element {
  const fetch = useContext(FetchContext);
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm<IFormData>({
    mode: 'all',
  });

  const onSubmitHandler: SubmitHandler<IFormData> = async (data) => {
    try {
      let res = await fetch?.authAxios.post('/login', {
        username: data.username,
        password: data.password,
      });
      console.log(res);
    } catch (e: any) {
      let errors = e.response.data.errors;
      for (let name of Object.keys(errors)) {
        if (name === 'username' || name === 'password') {
          setError(name, { message: errors[name].msg }, { shouldFocus: true });
        }
      }
    }
  };

  return (
    <div
      className={
        'min-w-[320px] flex justify-center items-center py-5 px-4 border border-solid rounded border-gray-400'
      }
    >
      <form
        className={'w-full'}
        onSubmit={handleSubmit(onSubmitHandler)}
        autoComplete={'off'}
      >
        <div className={'mb-4 flex flex-col'}>
          <label htmlFor='username' className={'mb-1'}>
            Username:
          </label>
          <input
            type='text'
            id={'username'}
            className={'h-[30px] text-[14px] px-2'}
            {...register('username', {
              required: 'Username is required',
            })}
          />
          <span className={'text-[12px] text-right text-red-500'}>
            {errors.username?.message}
          </span>
        </div>
        <div className={'mb-4 flex flex-col'}>
          <label htmlFor='password' className={'mb-1'}>
            Password:
          </label>
          <input
            type='password'
            id={'password'}
            className={'h-[30px] text-[14px] px-2'}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                message: 'Password must be greater than 8',
                value: 8,
              },
            })}
          />
          <span className={'text-[12px] text-right text-red-500'}>
            {errors.password?.message}
          </span>
        </div>
        <div className={'flex flex-col items-center justify-center'}>
          <input
            type='submit'
            value='Login'
            className={
              'w-full rounded h-[35px] bg-green-400 border-green-400 text-[16px] text-white mb-2'
            }
          />
          <Link href={'/register'}>
            <input
              type='button'
              value='Register'
              className={
                'w-full rounded h-[35px] bg-red-400 border-red-400 text-[16px] text-white'
              }
            />
          </Link>
        </div>
      </form>
    </div>
  );
}
