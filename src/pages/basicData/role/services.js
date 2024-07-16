import { get, post } from '@/utils/http';

// 分页查询角色信息
export const getPageRole = (data) => get('/api/inside/role/pageRoleInfo', data);

// 查询角色列表信息
export const getRoleList = (data) => get('/api/inside/role/listRoles', data);

// 新增角色
export const addRole = (data) => post('/api/inside/role/add', data);

// 更新角色
export const updateRole = (data) => post('/api/inside/role/update', data);

// 删除部门
export const delRole = (roleId) => post(`/api/inside/role/del/${roleId}`);

// 批量删除部门
export const batchDelRole = (data) => post('/api/inside/role/batchDel', data);

// 查询部门详细信息
export const getPageUser = (data) => get(`/api/inside/role/getRoleInfoById/${roleId}`, data);
