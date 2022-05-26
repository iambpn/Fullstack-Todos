import RegisterForm from '../components/register';

export default function Register(): JSX.Element {
  return (
    <div className={'centerDiv'}>
      <style jsx>{`
        .centerDiv {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding-bottom: 40px;
        }
      `}</style>
      <h2 className={'text-center'}>Registration</h2>
      <RegisterForm />
    </div>
  );
}
