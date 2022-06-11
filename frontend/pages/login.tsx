import LoginForm from '../components/login';
import checkAuth from '../components/hoc/checkAuth';

function Login() {
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

export default checkAuth(Login, {}, false, '/');
