import { history } from '@umijs/max';
import { message, Modal } from 'antd';
import axios from 'axios';
import { stringify } from 'querystring';

/**
 * 需要重新登录的code
 */
const authorityFailureCodes = [202];

const request = axios.create({
  baseURL: API_HOST,
  timeout: 1000 * 30,
  headers: {
    'Content-type': 'application/json',
  },
});

request.interceptors.request.use(
  (config) => {
    config.headers = {
      ...config.headers,
      Authorization: localStorage.getItem('token'),
    };
    return config;
  },
  (error) => {
    Modal.error({ title: error.message, centered: true });
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  (response) => {
    // tonken过期获取新的token值
    const { authorization } = response.headers;
    if (authorization) {
      localStorage.setItem('token', authorization);
    }
    const { code, msg, data } = response.data;
    const { throwError, showOriginResponse = false, showErrorMessage = true } = response.config;

    // 重新登录
    if (authorityFailureCodes.includes(code)) {
      const { search, pathname } = window.location;
      const urlParams = new URL(window.location.href).searchParams;
      const redirect = urlParams.get('redirect');
      if (window.location.pathname !== '/login' && !redirect) {
        history.replace({
          pathname: '/login',
          search: stringify({
            redirect: pathname + search,
          }),
        });
      }
    }

    // 返回服务端原始响应数据，自行处理错误场景
    if (showOriginResponse) return response.data;

    // 业务成功处理
    if (code === 200) {
      return data === '' || data === null || data === undefined ? true : data;
    }

    // 业务失败处理
    if (code !== 200) {
      // 自行抛出错误
      if (throwError) return Promise.reject(msg);
      // 显示错误提示
      if (showErrorMessage) message.error(msg);
      return undefined;
    }

    return response.data;
  },
  (error) => {
    Modal.error({ title: error.message, centered: true });
    return Promise.reject(error);
  },
);

const requestWithParams = (method) => (url, data, config) => {
  if (method === 'get' && data) {
    const queryString = stringify(data);
    return request[method](`${url}?${queryString}`, config);
  }
  return request[method](url, data, config);
};

const get = requestWithParams('get');
const post = requestWithParams('post');
const put = requestWithParams('put');
const del = requestWithParams('delete');

const postForm = (url, formData, config = {}) => {
  return request.post(url, formData, {
    ...config,
    headers: {
      ...config.headers,
      'Content-Type': 'multipart/form-data',
    },
  });
};

export { get, post, put, del, postForm };

export default request;
