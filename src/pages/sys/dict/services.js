import { get, post } from '@/utils/http';

// 更新数据字典信息
export const update = (data) => post('/api/inside/dict/update', data);

// 更新数据字典项信息
export const updateItem = (data) => post('/api/inside/dict/updateItem', data);

// 批量删除数据字典信息
export const batchDel = (data) => post('/api/inside/dict/batchDel', data);

// 批量删除数据字典项信息
export const batchDelItem = (data) => post('/api/inside/dict/batchDelItem', data);

// 新增数据字典项信息
export const addItem = (data) => post(`/api/inside/dict/addItem`, data);

// 根据数据字典ID查询数据字典项信息
export const queryItemListByParams = (data) => get('/api/inside/dict/queryItemListByParams', data);

// 查询可用数据字典项列表信息
export const queryAvailItemList = (data) => get(`/api/inside/dict/queryAvailItemList`, data);

// 分页查询数据字典信息
export const pageDictInfo = (data) => get(`/api/inside/dict/pageDictInfo`, data);

// 查询数据字典列表信息
export const listDicts = (data) => get(`/api/inside/dict/listDicts`, data);

// 查询数据字典详细信息
export const getDictInfoById = (dictId) => get(`/api/inside/dict/getDictInfoById/${dictId}`);

// 删除数据字典项信息
export const delItem = (itemId) => post(`/api/inside/dict/delItem/${itemId}`);

// 删除数据字典信息
export const delDict = (dictId) => post(`/api/inside/dict/del/${dictId}`);
