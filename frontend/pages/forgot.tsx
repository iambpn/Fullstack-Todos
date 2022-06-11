import ForgotPasswordForm from '../components/frogot';
import { GetStaticPropsContext, GetStaticPropsResult } from 'next';
import checkAuth from '../components/hoc/checkAuth';

type Props = {
  data: string;
};

function Forgot(props: Props): JSX.Element {
  return (
    <div className={'centerDiv'}>
      <style jsx>{`
        .centerDiv {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
      <h2 className={'text-center'}>Forgot Password.</h2>
      <ForgotPasswordForm />
    </div>
  );
}

export function getStaticProps(
  context: GetStaticPropsContext
): GetStaticPropsResult<Props> {
  return {
    props: {
      data: '',
    },
  };
}

export default checkAuth<Props>(Forgot, { data: '' }, false, '/');
