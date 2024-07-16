import {
  ExclamationCircleFilled,
  MinusCircleOutlined,
  MoreOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Dropdown, message, Modal } from 'antd';
import { useRef, useState } from 'react';
import DetailDrawer from './components/detailDrawer';
import EditModal from './components/editModal';
import { tableColumn } from './fields';
import styles from './index.less';
import { batchDelRole, delRole, getRoleList } from './services';

const Organization = () => {
  const actionRef = useRef();
  const [currentRecord, setCurrentRecord] = useState();
  const [detailVisible, setDetailVisible] = useState(false);
  const [editModalType, setEditModalType] = useState();
  const [editModalVisible, setEditModalVisible] = useState(false);

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
      label: '删除',
      key: 'del',
      danger: true,
    },
  ];

  const handleDel = (record) => {
    let subTitle = '';
    let ruleIds = [];
    let delApi = delRole;

    if (Array.isArray(record)) {
      subTitle = record.map((item) => item.roleName).join(', ');
      ruleIds = record.map((item) => item.roleId);
      delApi = batchDelRole;
    } else {
      subTitle = record.roleName;
      ruleIds = record.roleId;
    }

    Modal.confirm({
      title: `确定要删除角色【${subTitle}】吗？`,
      icon: <ExclamationCircleFilled />,
      async onOk() {
        const res = await delApi(ruleIds);
        if (res) {
          message.success('删除成功');
          actionRef.current.reload();
        }
      },
      onCancel() {},
    });
  };

  const handleAdd = () => {
    setEditModalType(0);
    setEditModalVisible(true);
  };

  const handleMenuClick = (e, record) => {
    e.domEvent.stopPropagation();
    setCurrentRecord(record);
    switch (e.key) {
      case 'query':
        setDetailVisible(true);
        break;
      case 'edit':
        setEditModalType(1);
        setEditModalVisible(true);
        break;
      case 'del':
        handleDel(record);
        break;
      case 'move':
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

  return (
    <PageContainer title={false} className={styles.container}>
      <ProTable
        actionRef={actionRef}
        headerTitle="角色列表"
        columns={[...tableColumn, optionsColumn]}
        params={{}}
        search={false}
        options={{ reload: false }}
        dateFormatter="string"
        rowKey={(record) => record.roleId}
        pagination={false}
        toolBarRender={(_, { selectedRows, selectedRowKeys }) => {
          const defaultBtns = [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                handleAdd(0);
              }}
            >
              <PlusCircleOutlined /> 新增角色
            </Button>,
          ];
          let otherBtn = [];
          if (selectedRowKeys.length) {
            otherBtn = [
              <Button
                danger
                key="primary"
                onClick={() => {
                  handleDel(selectedRows);
                }}
              >
                <MinusCircleOutlined /> 批量删除
              </Button>,
            ];
          }
          return [...otherBtn, ...defaultBtns];
        }}
        request={async (params = {}) => {
          const res = await getRoleList({
            ...params,
          });
          return {
            data: res || [],
          };
        }}
        rowSelection={{}}
        onRow={(record) => {
          return {
            onClick: () => {
              setCurrentRecord(record);
              setDetailVisible(true);
            },
          };
        }}
        tableAlertRender={false}
      />
      {editModalVisible && (
        <EditModal
          open={editModalVisible}
          type={editModalType}
          data={currentRecord}
          onCancel={() => {
            setEditModalVisible(false);
          }}
          refresh={() => {
            actionRef.current.clearSelected();
            actionRef.current.reload();
          }}
        />
      )}
      <DetailDrawer
        open={detailVisible}
        data={currentRecord}
        onClose={() => setDetailVisible(false)}
      />
    </PageContainer>
  );
};

export default Organization;
