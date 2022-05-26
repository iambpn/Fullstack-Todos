import * as yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useContext, useEffect, useState } from 'react';
import ReqErrorResolver from '../hooks/ReqErrorResolver';
import { FetchContext } from '../../store/FetchContext';
import { useRouter } from 'next/router';

const schema = yup.object({
  answer: yup
    .string()
    .min(10, 'Explain your answer in more than 10 chars.')
    .max(200, 'Explain your answer in less than 200 chars.')
    .required('Secret Answer is required.'),
  password: yup
    .string()
    .min(8, 'Password length must be greater than 8.')
    .required('Password is required.'),
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
});

type IResetForm = yup.InferType<typeof schema>;

type ResetResponse = {
  msg: string;
};

type Props = {
  question: string;
  uniqueKey: string;
};
export default function ResetForm(props: Props): JSX.Element {
  const fetch = useContext(FetchContext);
  const router = useRouter();
  const { resolver: errResolver } = ReqErrorResolver();
  const [serverErr, setServerErr] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

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
  } = useForm<IResetForm>({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  const onSubmitHandler: SubmitHandler<IResetForm> = async (data) => {
    try {
      let res = await fetch?.authAxios.post<ResetResponse>(
        `/forgot/${props.uniqueKey}/reset`,
        {
          answer: data.answer,
          new_password: data.password,
          confirm_password: data.confirmPassword,
        }
      );
      setIsSuccess(true);
      setServerErr('Password Reset Successful.');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (e) {
      let errors = errResolver(e, ['key']);
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
        'w-[500px] flex justify-center items-center py-5 px-4 border border-solid rounded border-gray-400'
      }
    >
      <form
        className={'w-full'}
        onSubmit={handleSubmit(onSubmitHandler)}
        autoComplete={'off'}
      >
        {serverErr !== '' && (
          <span
            className={
              'text-[16px] text-center block mb-3 ' +
              (isSuccess ? 'text-green-500' : 'text-red-500')
            }
          >
            {serverErr}
          </span>
        )}
        <div className={'mb-4 flex flex-col'}>
          <label htmlFor='key' className={'mb-1'}>
            Secret Question:
          </label>
          <input
            type='text'
            id={'key'}
            className={
              'h-[30px] text-[14px] px-2 text-black bg-white border-white border-solid'
            }
            value={props.question}
            disabled={true}
          />
        </div>
        <div className={'mb-4 flex flex-col'}>
          <label htmlFor='key' className={'mb-1'}>
            Secret Answer:
          </label>
          <input
            type='text'
            id={'key'}
            className={'h-[30px] text-[14px] px-2'}
            {...register('answer')}
          />
          <span className={'text-[12px] text-right text-red-500'}>
            {errors.answer?.message}
          </span>
        </div>
        <div className='flex flex-wrap sm:flex-nowrap'>
          <div className={'mb-4 flex flex-col w-full sm:w-1/2 sm:mr-2'}>
            <label htmlFor='password' className={'mb-1'}>
              New Password:
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
        <div className={'flex flex-col items-center justify-center'}>
          <input
            type='submit'
            value='Reset Password'
            className={
              'w-full rounded h-[35px] bg-green-400 border-green-400 text-[16px] text-white mb-2'
            }
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}
