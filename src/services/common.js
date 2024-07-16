import { get, post, postForm } from '@/utils/http';

// 退出登录
export const loginOut = () => get('/api/inside/auth/logout');

// userinfo
export const getCurrentUserInfo = () => get('/api/inside/auth/getCurrentUserInfo');

// 修改密码
export const changePwd = (data) => post('/api/inside/user/modifyUserPwd', data);

// 查询可用数据字典项列表信息
export const queryAvailItemList = (data) => get(`/api/inside/dict/queryAvailItemList`, data);

// 多文件上传
export const uploadFiles = (data) => post('/api/inside/file/uploadFiles', data);

// 单文件上传
export const uploadFile = (data) => postForm('/api/inside/file/uploadFile', data);

// 批量删除文件
export const batchDel = (data) => post('/api/inside/file/batchDel', data);

// 获取关联ID
export const getRelationId = (data) => get('/api/inside/file/getRelationId', data);

// 文件下载
export const downloadFile = (fileId) => post(`/api/inside/file/download/${fileId}`);
