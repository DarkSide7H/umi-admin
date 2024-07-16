import EnhanceSelect from '@/components/EnhanceSelect';
import { defaultPagination } from '@/constants';
import { queryAvailItemList } from '@/services/common';
import { fullFileUrl, transformToTreeData } from '@/utils/shared';
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined,
  UserAddOutlined,
  UsergroupDeleteOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Descriptions,
  Drawer,
  Dropdown,
  Image,
  message,
  Modal,
  Space,
  Tag,
  Tree,
  TreeSelect,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { getRoleList } from '../role/services';
import OrgEdit from './components/orgEdit';
import UserEdit from './components/userEdit';
import { GENDER_ENUM, tableColumn } from './fields';
import styles from './index.less';
import {
  batchDelUser,
  delDepart,
  delUser,
  getDepartTree,
  getPageUser,
  getUserInfoById,
  moveUserDepart,
  updateDepart,
  updatePwd,
} from './services';

const defaultTree = [
  {
    key: 'all',
    value: 'all',
    title: '(全部员工)',
    departId: '',
    children: [],
  },
];

const Organization = () => {
  const [selectDept, setSelectDept] = useState(null);
  const [orgModalVisible, setOrgModalVisible] = useState(false);
  const [orgModalType, setOrgModalType] = useState(0); // 0新增 1修改
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [userModalType, setUserModalType] = useState(0); // 0新增 1修改
  const [userData, setUserData] = useState({});
  const [userDetailVisible, setUserDetailVisible] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [departmentType, setDepartmentType] = useState([]);
  const [roles, setRoles] = useState([]);

  const actionRef = useRef();
  const getRoles = async () => {
    const res = await getRoleList();
    setRoles(res);
  };
  // 部门类型
  const getDepartmentType = async () => {
    const res = await queryAvailItemList({ dictCode: 'department_type' });
    setDepartmentType(res);
  };

  const fetchDepartTree = async () => {
    const data = await getDepartTree();
    setTreeData(transformToTreeData(data));
    if (!selectDept) {
      setSelectDept(defaultTree);
    }
  };

  useEffect(() => {
    fetchDepartTree();
    getDepartmentType();
    getRoles();
  }, []);

  const refresh = () => {
    fetchDepartTree();
  };

  const onSelect = (selectedKeys, { node }) => {
    setSelectDept(node);
  };

  const fetchUserDetail = async (userId) => {
    const res = await getUserInfoById(userId);
    setUserData(res);
  };

  useEffect(() => {
    if (actionRef.current) {
      actionRef.current.clearSelected();
      actionRef.current.reload();
    }
  }, [selectDept]);

  const items = [
    {
      label: '查看',
      key: 'query',
    },
    {
      label: '编辑',
      key: 'edit',
    },
    {
      label: '移动',
      key: 'move',
    },
    {
      label: '删除',
      key: 'del',
      danger: true,
    },
    {
      label: '重置密码',
      key: 'resetPwd',
    },
  ];

  const handleUserMove = (record) => {
    let subTitle = '';
    let userIds = [];

    if (Array.isArray(record)) {
      subTitle = record.map((item) => item.username).join(', ');
      userIds = record.map((item) => item.userId);
    } else {
      subTitle = record.username;
      userIds = [record.userId];
    }

    let selectedDepartId = null;

    Modal.confirm({
      title: `移动员工【${subTitle}】`,
      icon: <ExclamationCircleFilled />,
      content: (
        <TreeSelect
          style={{ width: '100%' }}
          allowClear
          treeDefaultExpandAll
          treeData={treeData}
          placeholder="请选择所属部门"
          onChange={(value) => {
            selectedDepartId = value;
          }}
        />
      ),
      onOk() {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
          if (selectedDepartId) {
            const res = await moveUserDepart({ userIds, departId: selectedDepartId });
            if (res) {
              message.success('移动成功');
              actionRef.current.reload();
              resolve();
            } else {
              reject();
            }
          } else {
            message.error('请选择一个部门');
            reject();
          }
        });
      },
      onCancel() {},
    });
  };

  const handleUserDel = (record) => {
    let subTitle = '';
    let userIds = [];
    let delApi = delUser;

    if (Array.isArray(record)) {
      subTitle = record.map((item) => item.username).join(', ');
      userIds = record.map((item) => item.userId);
      delApi = batchDelUser;
    } else {
      subTitle = record.username;
      userIds = record.userId;
    }

    Modal.confirm({
      title: `确定要删除员工【${subTitle}】吗？`,
      icon: <ExclamationCircleFilled />,
      async onOk() {
        const res = await delApi(userIds);
        if (res) {
          message.success('删除成功');
          actionRef.current.reload();
        }
      },
      onCancel() {},
    });
  };

  const handleUserResetPwd = (record) => {
    Modal.confirm({
      title: `确定要重置员工【${record.username}】的密码吗？`,
      icon: <ExclamationCircleFilled />,
      async onOk() {
        const res = await updatePwd(record.userId);
        if (res) {
          message.success('密码重置成功');
          actionRef.current.reload();
        }
      },
      onCancel() {},
    });
  };

  const handleUserDetail = async (userId) => {
    if (!userId) return;
    await fetchUserDetail(userId);
    setUserDetailVisible(true);
  };

  const handleUserEdit = async (userId) => {
    await fetchUserDetail(userId);
    setUserModalType(1);
    setUserModalVisible(true);
  };

  const handleMenuClick = (e, record) => {
    e.domEvent.stopPropagation();
    switch (e.key) {
      case 'query':
        handleUserDetail(record.userId);
        break;
      case 'edit':
        handleUserEdit(record.userId);
        break;
      case 'move':
        handleUserMove(record);
        break;
      case 'del':
        handleUserDel(record);
        break;
      case 'resetPwd':
        handleUserResetPwd(record);
        break;
    }
  };

  const optionsColumn = {
    title: '操作',
    dataIndex: 'options',
    fixed: 'right',
    width: 100,
    align: 'center',
    hideInSearch: true,
    render: (val, record) => {
      return (
        <>
          <Dropdown menu={{ items, onClick: (e) => handleMenuClick(e, record) }}>
            <Button
              type="link"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <MoreOutlined />
            </Button>
          </Dropdown>
        </>
      );
    },
  };

  const handleOrgAdd = () => {
    setOrgModalType(0);
    setOrgModalVisible(true);
  };

  const handleOrgEdit = () => {
    setOrgModalType(1);
    setOrgModalVisible(true);
  };

  const handleOrgDel = () => {
    Modal.confirm({
      title: `确定要删除部门【${selectDept.departName}】吗？`,
      icon: <ExclamationCircleFilled />,
      async onOk() {
        const res = await delDepart({ departId: selectDept.departId });
        if (res) {
          message.success('部门删除成功');
          setSelectDept(defaultTree);
          refresh();
        }
      },
      onCancel() {},
    });
  };

  const handleUserAdd = (type) => {
    setUserModalType(type);
    setUserModalVisible(true);
  };

  const renderDepartmentName = (val) =>
    departmentType.find((item) => item.itemValue === val)?.itemDesc ?? '-';

  const formatOptions = (options) => {
    return options.map((item) => {
      const labelParts = [item.realName, item.departName, item.mobile, item.idCard].filter(Boolean);
      const label = labelParts.join(' ');
      return {
        label,
        value: item.userId,
      };
    });
  };

  const onDrop = async (info) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };

    const data = [...treeData];

    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    let newParentId;
    if (info.dropToGap) {
      newParentId = info.node.parentId;
    } else {
      newParentId = info.node.key;
    }

    if (newParentId === undefined || newParentId === null || newParentId === '-1') {
      newParentId = '-1';
    }

    dragObj.parentId = newParentId;

    const updateSortNoAndAPI = async (nodes, parentId) => {
      let sortNo = 1;
      for (const node of nodes) {
        if (node.parentId === parentId) {
          if (node.sortNo !== sortNo) {
            node.sortNo = sortNo++;
            const updatedArea = {
              departId: node.departId,
              parentId: node.parentId,
              departName: node.departName,
              shortName: node.shortName,
              departType: node.departType,
              sortNo: node.sortNo,
              remarks: node.remarks,
            };

            try {
              const response = await updateDepart(updatedArea);
              if (!response) {
                throw new Error('更新失败');
              }
            } catch (error) {
              message.error('部门信息更新失败');
              return;
            }
          } else {
            sortNo++;
          }
        }
        if (node.children && node.children.length > 0) {
          await updateSortNoAndAPI(node.children, node.key);
        }
      }
    };

    const getParentNodeAndChildren = (nodes, parentId) => {
      let parentNode = null;
      const children = [];
      const loop = (data, key) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].key === key) {
            parentNode = data[i];
            if (data[i].children) {
              children.push(...data[i].children);
            }
          }
          if (data[i].children) {
            loop(data[i].children, key);
          }
        }
      };
      loop(nodes, parentId);
      return { parentNode, children };
    };

    const { parentNode, children } = getParentNodeAndChildren(data, newParentId);
    if (parentNode) {
      await updateSortNoAndAPI(children, newParentId);
    } else {
      await updateSortNoAndAPI(data, '-1');
    }

    setTreeData(data);
    message.success('部门信息更新成功');
  };

  return (
    <PageContainer title={false}>
      <div className={styles.content}>
        <Card
          title={'组织机构'}
          className={styles.aside}
          extra={
            <Button type="text" onClick={() => handleOrgAdd()}>
              <PlusOutlined />
            </Button>
          }
        >
          <Tree
            showLine
            switcherIcon={<DownOutlined />}
            treeData={[...defaultTree, ...treeData]}
            defaultExpandAll
            defaultSelectedKeys={['-1']}
            blockNode
            onSelect={onSelect}
            draggable
            onDrop={onDrop}
          />
        </Card>
        <div className={styles.detail}>
          {selectDept?.departId ? (
            <Card
              title={selectDept?.departName}
              extra={
                <Space>
                  <Button
                    // disabled={!selectDept}
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      handleOrgAdd();
                    }}
                  >
                    {!selectDept ? '添加部门' : '添加子部门'}
                  </Button>
                  <Button
                    disabled={!selectDept}
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => handleOrgEdit()}
                  >
                    修改
                  </Button>
                  <Button
                    disabled={!selectDept}
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleOrgDel()}
                  >
                    删除部门
                  </Button>
                </Space>
              }
            >
              <Descriptions size="small">
                <Descriptions.Item label="部门名称">{selectDept?.departName}</Descriptions.Item>
                <Descriptions.Item label="部门简称">{selectDept?.shortName}</Descriptions.Item>
                <Descriptions.Item label="部门类型">
                  {renderDepartmentName(selectDept?.departType)}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          ) : null}
          <div
            className={styles.table}
            style={{ marginTop: selectDept?.departId ? '10px' : '0px' }}
          >
            <ProTable
              actionRef={actionRef}
              headerTitle="员工列表"
              manualRequest
              columns={[...tableColumn, optionsColumn]}
              params={{ departId: selectDept?.departId }}
              search={false}
              dateFormatter="string"
              rowKey={(record) => record.userId}
              pagination={defaultPagination}
              options={{
                reload: false,
                search: false,
              }}
              toolbar={{
                title: (
                  <>
                    员工列表
                    {!selectDept?.departId && (
                      <EnhanceSelect
                        key="usersearch"
                        style={{ width: '320px', paddingLeft: '20px' }}
                        placeholder={'输入关键字快捷查看员工详情'}
                        preload={false}
                        request={getPageUser}
                        searchKey={'keyword'}
                        formatOptions={formatOptions}
                        suffixIcon={<SearchOutlined />}
                        onChange={(id) => {
                          handleUserDetail(id);
                        }}
                      />
                    )}
                  </>
                ),
              }}
              toolBarRender={(_, { selectedRows, selectedRowKeys }) => {
                const defaultBtns = [
                  <Button
                    type="primary"
                    key="primary"
                    onClick={() => {
                      handleUserAdd(0);
                    }}
                  >
                    <UserAddOutlined /> 新增员工
                  </Button>,
                ];
                let otherBtn = [];
                if (selectedRowKeys.length) {
                  otherBtn = [
                    <Button
                      key="primary"
                      onClick={() => {
                        handleUserMove(selectedRows);
                      }}
                    >
                      <UsergroupDeleteOutlined /> 批量移动
                    </Button>,
                    <Button
                      danger
                      key="primary"
                      onClick={() => {
                        handleUserDel(selectedRows);
                      }}
                    >
                      <UsergroupDeleteOutlined /> 批量删除
                    </Button>,
                  ];
                }
                return [...otherBtn, ...defaultBtns];
              }}
              request={async (params = {}) => {
                actionRef.current.clearSelected();
                const res = await getPageUser({
                  ...params,
                  pageNumber: params.current,
                });
                return {
                  data: res.records,
                  success: res,
                  total: res.total,
                };
              }}
              rowSelection={{}}
              onRow={(record) => {
                return {
                  onClick: () => {
                    setUserData(record);
                    setUserDetailVisible(true);
                  },
                };
              }}
              tableAlertRender={false}
            />
          </div>
        </div>
      </div>
      <Drawer open={userDetailVisible} closable={false} onClose={() => setUserDetailVisible(false)}>
        <Descriptions column={1} labelStyle={{ width: '90px' }} title="员工信息">
          <Descriptions.Item label="用户名">{userData.username}</Descriptions.Item>
          <Descriptions.Item label="姓名">{userData.realName}</Descriptions.Item>
          <Descriptions.Item label="所属部门">{userData.departName}</Descriptions.Item>
          <Descriptions.Item label="身份证号">{userData.idCard}</Descriptions.Item>
          <Descriptions.Item label="手机号">{userData.mobile}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{userData.telphone}</Descriptions.Item>
          <Descriptions.Item label="性别">{GENDER_ENUM[userData.gender] || '-'}</Descriptions.Item>
          <Descriptions.Item label="角色">
            <div>
              {userData?.userRoleList &&
                userData.userRoleList.map((v) => (
                  <Tag key={v.roleId} style={{ margin: '0 4px 4px 0' }}>
                    {v.roleName}
                  </Tag>
                ))}
            </div>
          </Descriptions.Item>
          {/** 
          <Descriptions.Item label="出生日期">{userData.birthday || '-'}</Descriptions.Item>
           */}
          <Descriptions.Item label="是否可登录">
            {
              <Tag color={['success', 'error', 'warning'][userData.status - 1]}>
                {['是', '否', '锁定'][userData.status - 1]}
              </Tag>
            }
          </Descriptions.Item>
          <Descriptions.Item label="照片">
            {(userData?.photoList || []).map((v) => (
              <Image key={v.fileId} width={200} src={fullFileUrl(v.fileUrl)} />
            ))}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
      {userModalVisible && (
        <UserEdit
          open={userModalVisible}
          type={userModalType}
          orgData={selectDept}
          userData={userData}
          treeData={treeData}
          roles={roles}
          refresh={() => {
            actionRef.current.reload();
          }}
          onCancel={() => setUserModalVisible(false)}
          onOk={() => {
            setUserModalVisible(false);
          }}
        />
      )}
      {orgModalVisible && (
        <OrgEdit
          open={orgModalVisible}
          type={orgModalType}
          refresh={refresh}
          orgData={selectDept}
          departmentType={departmentType}
          onCancel={() => setOrgModalVisible(false)}
          onOk={() => {
            setOrgModalVisible(false);
          }}
        />
      )}
    </PageContainer>
  );
};

export default Organization;
