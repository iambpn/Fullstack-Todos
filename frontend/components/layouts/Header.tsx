import { useContext } from 'react';
import { AuthContext } from '../../store/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Header(): JSX.Element {
  const auth = useContext(AuthContext);
  const router = useRouter();
  return (
    <>
      <div className={'border-0 border-b border-solid border-white'}>
        <div className={'py-4 flex justify-between items-center'}>
          <Link href={'/'}>
            <a className={'no-underline'}>
              <span className={'text-3xl text-green-500'}>Todos</span>
            </a>
          </Link>
          {auth.isAuthenticated() && (
            <span>Hi, {auth.authState?.userInfo?.username}</span>
          )}
          <div>
            {!auth.isAuthenticated() && (
              <button
                className={
                  'rounded px-4 py-2 bg-green-400 border-green-400 text-white'
                }
                onClick={async () => await router.push('/login')}
              >
                Login
              </button>
            )}
            {auth.isAuthenticated() && (
              <button
                className={
                  'rounded px-4 py-2 bg-red-400 border-red-400 text-white'
                }
                onClick={() => auth.logout()}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
