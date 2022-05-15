import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const config: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
};

class PubicHTTP {
  private static instance: AxiosInstance;

  private constructor() {}

  public static getInstance(): AxiosInstance {
    if (!PubicHTTP.instance) {
      PubicHTTP.instance = axios.create(config);
    }
    return PubicHTTP.instance;
  }
}

export default PubicHTTP;
