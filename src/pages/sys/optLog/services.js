import { get } from '@/utils/http';

// 分页查询日志信息
export const pageLogInfo = (data) => get('/api/inside/log/pageLogInfo', data);
