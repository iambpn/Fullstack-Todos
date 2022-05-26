import ForgotPasswordForm from '../components/frogot';

export default function forgot(): JSX.Element {
  return (
    <div className={'centerDiv'}>
      <style jsx>{`
        .centerDiv {
          position: absolute;
          left: 50%;
          top: 50%;
          -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
        }
      `}</style>
      <h2 className={'text-center'}>Forgot Password.</h2>
      <ForgotPasswordForm />
    </div>
  );
}
