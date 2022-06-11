import React, { createContext, useEffect, useState } from 'react';
import PubicHTTP from '../axios';
import { useRouter } from 'next/router';

type IAuthContext = {
  authState: IAuthState;
  isAuthenticated: () => boolean;
  refreshAccessToken: (username: string, password: string) => void;
  logout: () => void;
  getAccessToken: () => string | undefined;
  getNewTokenForRequest: (failedRequest: any) => Promise<any>;
  setAuthInfo: (authState: IAuthState) => void;
};
type IAuthProviderProps = { children: React.ReactNode };
type IAuthState = {
  token?: string;
  expiresAt?: string;
  userInfo?: IUser;
};

export type IUser = {
  activity: {
    last_login: Date;
    last_update: Date;
  };
  _id: string;
  name: string;
  email: string;
  phone_number: number;
};

export const AuthContext = createContext<IAuthContext>({
  authState: {},
  setAuthInfo: () => {},
  getNewTokenForRequest: async () => {},
  getAccessToken: () => undefined,
  refreshAccessToken(): void {},
  isAuthenticated: () => false,
  logout(): void {},
});

export function AuthProvider({ children }: IAuthProviderProps): JSX.Element {
  const router = useRouter();
  const [authState, setAuthState] = useState<IAuthState>({});
  const publicFetch = PubicHTTP.getInstance();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    const expiresAt = localStorage.getItem('expiresAt');

    setAuthState({
      token: token || undefined,
      userInfo: userInfo ? JSON.parse(userInfo) : undefined,
      expiresAt: expiresAt || undefined,
    });
  }, []);

  const isAuthenticated = (): boolean => {
    if (!authState.token || !authState.expiresAt) {
      return false;
    }
    let expiresAt = Number(authState.expiresAt);
    return new Date().getTime() / 1000 < expiresAt;
  };

  const setAuthInfo = ({ token, userInfo, expiresAt }: IAuthState) => {
    if (token && expiresAt && userInfo) {
      localStorage.setItem('token', token);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      localStorage.setItem('expiresAt', expiresAt);

      setAuthState({
        token,
        userInfo,
        expiresAt,
      });
    }
  };

  const refreshAccessToken = async () => {
    try {
      const { data } = await publicFetch.get('/token/refresh');
      setAuthState(Object.assign({}, authState, { token: data.token }));
    } catch (e) {
      return e;
    }
  };

  const getAccessToken = () => {
    let accessToken = localStorage.getItem('token');
    return accessToken ? accessToken : undefined;
  };

  // used in fetch context
  const getNewTokenForRequest = async (error: any) => {
    const { data } = await publicFetch.get('/token/refresh');
    error.response.config.headers['Authorization'] = `Bearer ${data.token}`;
    localStorage.setItem('token', data.token);
    return Promise.resolve();
  };

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('expiresAt');
    setAuthState({});
    await router.push('/login');
  };

  const context: IAuthContext = {
    authState,
    isAuthenticated,
    refreshAccessToken,
    logout,
    getAccessToken,
    getNewTokenForRequest,
    setAuthInfo,
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
}
