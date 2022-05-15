import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../store/AuthContext';
import { FetchProvider } from '../store/FetchContext';
import Header from '../components/layouts/Header';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <AuthProvider>
        <FetchProvider>
          <div className={'container mx-auto'}>
            <Header />
            <Component {...pageProps} />
          </div>
        </FetchProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp;
