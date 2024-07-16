import { fullFileUrl } from '@/utils/shared';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Image, Popover } from 'antd';

export const GENDER_ENUM = {
  '01': '男',
  '02': '女',
};

const imgContent = (val) => (
  <span onClick={(e) => e.stopPropagation()}>
    <Image key={val} width={200} src={val} />
  </span>
);

export const tableColumn = [
  {
    title: '照片',
    dataIndex: 'photo',
    align: 'center',
    ellipsis: true,
    hideInSearch: true,
    width: 80,
    render: (_, record) => {
      return (
        <>
          <Popover
            content={record.photoList && imgContent(fullFileUrl(record.photoList[0].fileUrl))}
          >
            <Avatar src={fullFileUrl(record?.photoList[0]?.fileUrl)} icon={<UserOutlined />} />
          </Popover>
        </>
      );
    },
  },
  {
    title: '姓名',
    dataIndex: 'realName',
  },
  {
    title: '用户名',
    dataIndex: 'username',
    hideInSearch: true,
  },
  {
    title: '所属部门',
    dataIndex: 'departName',
    ellipsis: true,
  },
  {
    title: '身份证号',
    dataIndex: 'idCard',
    width: 180,
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
  },
  // {
  //   title: '性别',
  //   dataIndex: 'gender',
  //   hideInSearch: true,
  //   render: (val) => GENDER_ENUM[val] || '-',
  // },
  // {
  //   title: '出生日期',
  //   dataIndex: 'birthday',
  //   hideInSearch: true,
  // },
  // {
  //   title: '状态',
  //   dataIndex: 'status',
  //   hideInSearch: true,
  //   render: (val) => (
  //     <Tag color={['success', 'error', 'warning'][val - 1]}>
  //       {['正常', '禁用', '锁定'][val - 1]}
  //     </Tag>
  //   ),
  // },
  // {
  //   title: '最后登录时间',
  //   dataIndex: 'lastLoginTime',
  //   hideInSearch: true,
  // },
];
