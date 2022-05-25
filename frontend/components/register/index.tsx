import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useContext, useEffect, useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ReqErrorResolver from '../hooks/ReqErrorResolver';
import { FetchContext } from '../../store/FetchContext';
import { useRouter } from 'next/router';

type RegisterResponse = {
  msg: string;
};

const schema = yup.object({
  firstName: yup.string().required('First name is required.'),
  lastName: yup.string().required('Last name is required.'),
  username: yup
    .string()
    .email('Username must be a valid email.')
    .required('Username is required.'),
  password: yup
    .string()
    .min(8, 'Password length must be greater than 8.')
    .required('Password is reuired.'),
  confirmPassword: yup
    .string()
    .min(8, 'Confirm Password length must be greater than 8.')
    .test(
      'Password Check',
      'Confirm password and Password must be same.',
      function (value) {
        return this.parent.password === value;
      }
    )
    .required('Confirm Password is required.'),
  phoneNumber: yup
    .string()
    .length(10, 'Phone number must be of 10 digit.')
    .required('Phone number is required.'),
});

type IRegisterFrom = yup.InferType<typeof schema>;

export default function RegisterForm(): JSX.Element {
  const fetch = useContext(FetchContext);
  const router = useRouter();
  const { resolver: errResolver } = ReqErrorResolver();
  const [serverErr, setServerErr] = useState('');

  useEffect(() => {
    if (serverErr != '') {
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
  } = useForm<IRegisterFrom>({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  const onSubmitHandler: SubmitHandler<IRegisterFrom> = async (data) => {
    try {
      await fetch?.authAxios.post<RegisterResponse>('/register', {
        name: data.firstName + ' ' + data.lastName,
        password: data.password,
        confirm_password: data.confirmPassword,
        username: data.username,
        phone_number: data.phoneNumber,
      });
      await router.push('/login');
    } catch (e) {
      let errors = errResolver(e, ['username', 'passwords']);
      console.log(errors);
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
        'w-[320px] sm:w-[500px] flex justify-center items-center py-5 px-4 border border-solid rounded border-gray-400'
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
        <div className='flex flex-wrap sm:flex-nowrap'>
          <div className={'mb-4 flex flex-col w-full sm:w-1/2 sm:mr-2'}>
            <label htmlFor='firstName' className={'mb-1'}>
              First Name:
            </label>
            <input
              type='text'
              id='firstName'
              className={'h-[30px] text-[14px] px-2'}
              {...register('firstName')}
            />
            <span className={'text-[12px] text-right text-red-500'}>
              {errors.firstName?.message}
            </span>
          </div>
          <div className={'mb-4 flex flex-col w-full sm:w-1/2 sm:ml-2'}>
            <label htmlFor='lastName' className={'mb-1'}>
              Last Name:
            </label>
            <input
              type='text'
              id={'lastName'}
              className={'h-[30px] text-[14px] px-2'}
              {...register('lastName')}
            />
            <span className={'text-[12px] text-right text-red-500'}>
              {errors.lastName?.message}
            </span>
          </div>
        </div>
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
        <div className='flex flex-wrap sm:flex-nowrap'>
          <div className={'mb-4 flex flex-col w-full sm:w-1/2 sm:mr-2'}>
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
          <div className={'mb-4 flex flex-col w-full sm:w-1/2 sm:ml-2'}>
            <label htmlFor='password' className={'mb-1'}>
              Confirm Password:
            </label>
            <input
              type='password'
              id={'password'}
              className={'h-[30px] text-[14px] px-2'}
              {...register('confirmPassword')}
            />
            <span className={'text-[12px] text-right text-red-500'}>
              {errors.confirmPassword?.message}
            </span>
          </div>
        </div>
        <div className={'mb-4 flex flex-col'}>
          <label htmlFor='number' className={'mb-1'}>
            Phone Number:
          </label>
          <input
            type='number'
            id={'number'}
            className={'h-[30px] text-[14px] px-2'}
            {...register('phoneNumber')}
          />
          <span className={'text-[12px] text-right text-red-500'}>
            {errors.phoneNumber?.message}
          </span>
        </div>
        <div className={'flex flex-col items-center justify-center'}>
          <input
            type='submit'
            value='Register'
            className={
              'w-full rounded h-[35px] bg-red-400 border-red-400 text-[16px] text-white mb-2'
            }
            disabled={isSubmitting}
          />
          <Link href={'/login'}>
            <input
              type='button'
              value='Back to Login'
              className={
                'w-full rounded h-[35px] bg-green-400 border-green-400 text-[16px] text-white'
              }
            />
          </Link>
        </div>
      </form>
    </div>
  );
}
