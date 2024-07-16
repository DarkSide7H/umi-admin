import { Tag } from 'antd';

export const ROLE_TYPE = {
  '01': '是',
  '02': '否',
};

export const tableColumn = [
  {
    title: '角色名称',
    dataIndex: 'roleName',
    width: 160,
  },
  {
    title: '角色编码',
    dataIndex: 'roleCode',
    width: 160,
  },
  {
    title: '系统内置',
    dataIndex: 'roleType',
    hideInSearch: true,
    width: 160,
    render: (val) => <Tag>{ROLE_TYPE[val]}</Tag>,
  },
  // {
  //   title: '角色类型描述',
  //   dataIndex: 'roleTypeDesc',
  //   hideInSearch: true,
  // },
  {
    title: '备注',
    dataIndex: 'remarks',
    hideInSearch: true,
    ellipsis: true,
  },
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
