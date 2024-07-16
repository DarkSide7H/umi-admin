import { get, remove, set } from 'js-cookie';

/**
 * 获取cookie数据
 * @param name
 * @returns
 */
export const getCookie = (name) => get(name) || '';

/**
 * 设置cookie
 * @param name
 * @param value
 * @param options
 * @returns
 */
export const setCookie = (name, value, options) => set(name, value, options);

/**
 * 移除cookie
 * @param name
 * @returns
 */
export const removeCookie = (name) => remove(name);
