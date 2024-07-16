export const to = (promise) => promise.then((data) => [null, data]).catch((err) => [err]);

export const isProd = process.env.NODE_ENV === 'production' && process.env.UMI_ENV === 'production';

// 后端数据转treeData
export const transformToTreeData = (data, key = 'departId', title = 'departName') => {
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map((item) => ({
    ...item,
    title: item[title],
    key: item[key],
    value: item[key],
    children:
      item.childList && item.childList.length > 0
        ? transformToTreeData(item.childList, key, title)
        : [],
  }));
};

export const fullFileUrl = (url) => (url ? `${API_HOST}/fileShow/${url}` : '');
