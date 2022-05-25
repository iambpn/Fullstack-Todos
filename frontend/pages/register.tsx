import RegisterForm from '../components/register';

export default function Register(): JSX.Element {
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
      <h2 className={'text-center'}>Registration</h2>
      <RegisterForm />
    </div>
  );
}
