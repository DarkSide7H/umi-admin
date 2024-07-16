import { get, post } from '@/utils/http';

// 无需登录访问接口-场地管理
export const getVenue = () => get('/api/inside/front/venue/listAll');

// 登录
export const login = (data) => post('/api/inside/auth/login', data);
