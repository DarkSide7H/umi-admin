import { get } from '@/utils/http';

// 获取菜单
export const queryMenuTree = (data) => get('/api/inside/menu/queryMenuTree', data);
