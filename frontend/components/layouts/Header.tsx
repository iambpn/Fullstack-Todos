import { useContext } from 'react';
import { AuthContext } from '../../store/AuthContext';
import Link from 'next/link';

export default function Header(): JSX.Element {
  const auth = useContext(AuthContext);
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
            <span className={'text-[18px]'}>
              Hi, {auth.authState?.userInfo?.name}
            </span>
          )}
          <div>
            {!auth.isAuthenticated() && (
              <Link href={'/login'}>
                <button
                  className={
                    'rounded px-4 py-2 bg-green-400 border-green-400 text-white'
                  }
                >
                  Login
                </button>
              </Link>
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
