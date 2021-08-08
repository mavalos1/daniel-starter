import Axios, { AxiosRequestConfig } from "axios";

import config from "@/config";
import storage from "@/utils/storage";
import useNotificationStore from "@/hooks/useNotificationStore";

function authRequestInterceptor(cf: AxiosRequestConfig) {
  const config = cf;
  const token = storage.getToken();
  if (token) {
    config.headers.authorization = token.toString();
  }

  config.headers.Accept = "application/json";
  return config;
}

const axios = Axios.create({
  baseURL: config.API_URL as string,
});

axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message;

    useNotificationStore((state) => state.pushNotification)({
      type: "error",
      title: "Error",
      message,
    });

    return Promise.reject(error);
  }
);

export default axios;
