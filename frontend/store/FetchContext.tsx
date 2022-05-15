import React, { createContext, useContext } from 'react';
import axios, { AxiosInstance } from 'axios';
import axiosAuthRefreshInterceptor from 'axios-auth-refresh';
import { AuthContext } from './AuthContext';

type IFetchContext = {
  authAxios: AxiosInstance;
};

const FetchContext = createContext<IFetchContext | undefined>(undefined);
const { Provider } = FetchContext;

const FetchProvider = ({ children }: { children: React.ReactNode }) => {
  const authContext = useContext(AuthContext);

  const authAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  /**
   * Add access token to request by intercepting it.
   */
  authAxios.interceptors.request.use(
    (config) => {
      config.headers!.Authorization = `Bearer ${authContext.getAccessToken()}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  /*
   * Response interceptor to check the response status code and getNewRefresh token.
   */
  // authAxios.interceptors.response.use(
  //   response => {
  //     return response;
  //   },
  //   async (error) => {
  //     const code =
  //       error && error.response ? error.response.status : 0;
  //     if (code === 401 || code === 403) {
  //       await authContext.getNewToken();
  //     }
  //     return Promise.reject(error);
  //   }
  // );

  // AxiosAuthRefresh to hit refresh token url on 401 response.
  axiosAuthRefreshInterceptor(authAxios, authContext.getNewTokenForRequest, {
    skipWhileRefreshing: false,
  });

  const context: IFetchContext = {
    authAxios,
  };

  return <Provider value={context}>{children}</Provider>;
};

export { FetchContext, FetchProvider };
