export const STATUS_TYPE = {
  key: {
    1: '正常',
    2: '禁用',
  },
  color: {
    1: 'success',
    2: 'error',
  },
};

export const tableColumn = [
  {
    title: '字典编码',
    dataIndex: 'dictCode',
  },
  {
    title: '字典名称',
    dataIndex: 'dictName',
  },
  // {
  //   title: '备注',
  //   dataIndex: 'remarks',
  //   hideInSearch: true,
  // },
  // {
  //   title: '状态',
  //   dataIndex: 'status',
  //   hideInSearch: true,
  //   render: (val) => <Tag color={STATUS_TYPE.color[val]}>{STATUS_TYPE.key[val]}</Tag>,
  // },
  // {
  //   title: '创建人',
  //   dataIndex: 'createByNm',
  //   hideInSearch: true,
  // },
  // {
  //   title: '创建时间',
  //   dataIndex: 'createTime',
  //   hideInSearch: true,
  // },
  // {
  //   title: '更新人',
  //   dataIndex: 'updateByNm',
  //   hideInSearch: true,
  // },
  // {
  //   title: '更新时间',
  //   dataIndex: 'updateTime',
  //   hideInSearch: true,
  // },
];

export const subTableColumn = [
  // {
  //   title: '字典项ID',
  //   dataIndex: 'itemId',
  // },
  {
    title: '字典项值',
    dataIndex: 'itemValue',
  },
  {
    title: '描述',
    dataIndex: 'itemDesc',
    hideInSearch: true,
  },
  // {
  //   title: '创建人',
  //   dataIndex: 'createByNm',
  //   hideInSearch: true,
  //   width: 80,
  // },
  // {
  //   title: '创建时间',
  //   dataIndex: 'createTime',
  //   hideInSearch: true,
  //   width: 120,
  // },
  // {
  //   title: '更新人',
  //   dataIndex: 'updateByNm',
  //   hideInSearch: true,
  //   width: 80,
  // },
  // {
  //   title: '更新时间',
  //   dataIndex: 'updateTime',
  //   hideInSearch: true,
  //   width: 120,
  // },
];
