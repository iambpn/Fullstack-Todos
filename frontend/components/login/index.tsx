import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { FetchContext } from '../../store/FetchContext';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AuthContext, IUser } from '../../store/AuthContext';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ReqErrorResolver from '../hooks/ReqErrorResolver';
import { TodoContext } from '../../store/TodoContext';

type LoginResponse = {
  expiresAt: number;
  msg: string;
  token: string;
  userInfo: IUser;
};

// schema validation
const schema = yup.object({
  username: yup
    .string()
    .email('Username must be a valid email.')
    .required('Username is required'),
  password: yup
    .string()
    .min(8, 'Password length must be greater than 8.')
    .required('Password is required'),
});

type IFormData = yup.InferType<typeof schema>;

export default function LoginForm(): JSX.Element {
  const fetch = useContext(FetchContext);
  const auth = useContext(AuthContext);
  const todoContext = useContext(TodoContext);
  const { resolver: errResolver } = ReqErrorResolver();
  const [serverErr, setServerErr] = useState('');

  useEffect(() => {
    if (serverErr !== '') {
      setTimeout(() => {
        setServerErr('');
      }, 8000);
    }
  }, [serverErr]);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<IFormData>({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  const onSubmitHandler: SubmitHandler<IFormData> = async (data) => {
    try {
      let res = await fetch?.authAxios.post<LoginResponse>('/login', {
        username: data.username,
        password: data.password,
      });

      auth.setAuthInfo({
        userInfo: res?.data.userInfo,
        expiresAt: String(res?.data.expiresAt) || undefined,
        token: res?.data.token,
      });
      await todoContext.fetchTodos();
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
        {serverErr !== '' && (
          <span className={'text-[16px] text-center text-red-500 block mb-3'}>
            {serverErr}
          </span>
        )}
        <div className={'mb-4 flex flex-col'}>
          <label htmlFor='username' className={'mb-1'}>
            Username:
          </label>
          <input
            type='email'
            id={'username'}
            className={'h-[30px] text-[14px] px-2'}
            {...register('username')}
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
            {...register('password')}
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
            disabled={isSubmitting}
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
          <Link href={'/forgot'}>
            <a className={'text-[16px] mt-3 text-white'}>Reset Password?</a>
          </Link>
        </div>
      </form>
    </div>
  );
}
