import LoginForm from '../components/login';

export default function Login() {
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
      <h2 className={'text-center'}>Login to Todos</h2>
      <LoginForm />
    </div>
  );
}
