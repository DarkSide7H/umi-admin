import { get, post } from '@/utils/http';

// 获取部门树
export const getDepartTree = () => get('/api/inside/depart/queryDepartTree');

// 新增部门
export const addDepart = (data) => post('/api/inside/depart/add', data);

// 更新部门
export const updateDepart = (data) => post('/api/inside/depart/update', data);

// 删除部门
export const delDepart = (data) => post(`/api/inside/depart/delById`, data);

// 分页查询员工信息
export const getPageUser = (data) => get('/api/inside/user/pageUserInfo', data);

// 新增用户信息
export const addUser = (data) => post('/api/inside/user/add', data);

// 更新用户信息
export const updateUser = (data) => post('/api/inside/user/update', data);

// 查询员工信息
export const getUserInfoById = (userId) => get(`/api/inside/user/getUserInfoById/${userId}`);

// 删除员工
export const delUser = (userId) => post(`/api/inside/user/del/${userId}`);

// 批量删除员工
export const batchDelUser = (data) => post('/api/inside/user/batchDel', data);

// 移动员工部门
export const moveUserDepart = (data) => post('/api/inside/user/moveUserDepart', data);

// 重置密码
export const updatePwd = (userId) => post(`/api/inside/user/resetUserPwd/${userId}`);
