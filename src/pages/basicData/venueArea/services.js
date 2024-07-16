import { get, post } from '@/utils/http';

/** 分区 */
// 更新分区信息
export const updateArea = (data) => post('/api/inside/area/update', data);

// 新增分区信息
export const addArea = (data) => post('/api/inside/area/add', data);

// 获取分区树
export const queryAreaTree = (data) => get('/api/inside/area/queryAreaTree', data);

// 分页查询分区信息
export const pageArea = (data) => get('/api/inside/area/pageArea', data);

// 查询分区详细信息
export const getAreaById = (data) => get(`/api/inside/area/getAreaById`, data);

// 删除分区信息
export const delAreaById = (data) => post('/api/inside/area/delById', data);

/** 房间管理 */
// 更新房间信息
export const updateRoom = (data) => post(`/api/inside/room/update`, data);

// 批量删除房间信息
export const batchDelRoom = (data) => post(`/api/inside/room/batchDel`, data);

// 新增房间信息
export const addRoom = (data) => post(`/api/inside/room/add`, data);

// 分页查询房间信息
export const pageRoomInfo = (data) => get(`/api/inside/room/pageRoomInfo`, data);

// 查询房间列表信息
export const listRooms = (data) => get(`/api/inside/room/listRooms`, data);

// 查询房间详细信息
export const getRoomInfoById = (data) => get('/api/inside/room/getRoomInfoById', data);

// 删除房间信息
export const delRoom = (roomId) => post(`/api/inside/room/del/${roomId}`);

/** 工位 */
// 新增或者修改工位信息
export const cubicleUpdate = (data) => post('/api/inside/cubicle/save-update', data);

// 批量删除工位信息
export const cubicleBatchDel = (data) => post('/api/inside/cubicle/batchDel', data);

// 查询工位列表信息
export const listCubicles = (data) => get('/api/inside/cubicle/listCubicles', data);

// 删除工位信息
export const cubiclesDel = (cubicleId) => get(`/api/inside/cubicle/del/${cubicleId}`);

/** 出入口 */
// 新增或者修改出入口信息
export const gateUpdate = (data) => post('/api/inside/gate/save-update', data);

// 批量删除出入口信息
export const gateBatchDel = (data) => post('/api/inside/gate/batchDel', data);

// 查询工位列表信息
export const listGates = (data) => get('/api/inside/gate/listGates', data);

// 删除工位信息
export const gateDel = (gateId) => get(`/api/inside/gate/del/{gateId}`);
