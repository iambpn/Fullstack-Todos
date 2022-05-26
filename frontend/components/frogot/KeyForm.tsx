import * as yup from 'yup';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useContext, useEffect, useState } from 'react';
import ReqErrorResolver from '../hooks/ReqErrorResolver';
import { FetchContext } from '../../store/FetchContext';

type Props = {
  setQuestion: Function;
  setKey: Function;
};

const schema = yup.object({
  key: yup.string().required('Please enter username or phone number.'),
});
type IKeyForm = yup.InferType<typeof schema>;

type GetQuestionResponse = {
  msg: string;
  secretQuestion: string;
};

export default function KeyForm(props: Props): JSX.Element {
  const fetch = useContext(FetchContext);
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
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<IKeyForm>({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  const onSubmitHandler: SubmitHandler<IKeyForm> = async (data) => {
    try {
      let res = await fetch?.authAxios.get<GetQuestionResponse>(
        `/forgot/${data.key}/question`
      );
      props.setQuestion(res?.data.secretQuestion);
      props.setKey(data.key);
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
        'w-[320px] flex justify-center items-center py-5 px-4 border border-solid rounded border-gray-400'
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
          <label htmlFor='key' className={'mb-1'}>
            Enter Username or Phone Number:
          </label>
          <input
            type='text'
            id={'key'}
            className={'h-[30px] text-[14px] px-2'}
            {...register('key')}
          />
          <span className={'text-[12px] text-right text-red-500'}>
            {errors.key?.message}
          </span>
        </div>
        <div className={'flex flex-col items-center justify-center'}>
          <input
            type='submit'
            value='Find User'
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
