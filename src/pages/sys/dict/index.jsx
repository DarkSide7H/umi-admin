import {
  ExclamationCircleFilled,
  MinusCircleOutlined,
  MoreOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Col, Dropdown, message, Modal, Row } from 'antd';
import { useRef, useState } from 'react';
import DetailDrawer from './components/detailDrawer';
import EditModal from './components/editModal';
import { subTableColumn, tableColumn } from './fields';
import styles from './index.less';
import { batchDel, delItem, listDicts, queryItemListByParams } from './services';

const Index = () => {
  const tableRef = useRef();
  const subTableRef = useRef();
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
    let delApi = delItem;

    if (Array.isArray(record)) {
      subTitle = record.map((item) => item.itemDesc).join(', ');
      ruleIds = record.map((item) => item.itemId);
      delApi = batchDel;
    } else {
      subTitle = record.itemDesc;
      ruleIds = record.itemId;
    }

    Modal.confirm({
      title: `确定要删除字典项【${subTitle}】吗？`,
      icon: <ExclamationCircleFilled />,
      async onOk() {
        const res = await delApi(ruleIds);
        if (res) {
          message.success('删除成功');
          subTableRef.current.clearSelected();
          subTableRef.current.reload();
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
    <PageContainer title={false}>
      <div className={styles.content}>
        <Row gutter={16}>
          <Col span={10} className={styles.aside}>
            <ProTable
              actionRef={tableRef}
              headerTitle="字典列表"
              columns={tableColumn}
              params={{}}
              search={false}
              options={{ reload: false }}
              dateFormatter="string"
              rowKey={(record) => record.dictId}
              pagination={false}
              request={async (params = {}) => {
                const res = await listDicts({
                  ...params,
                });
                return {
                  data: res,
                  success: true,
                };
              }}
              onRow={(record) => {
                return {
                  onClick: () => {
                    setCurrentRecord(record);
                    subTableRef.current.reload();
                  },
                };
              }}
              tableAlertRender={false}
            />
          </Col>
          <Col span={14} className={styles.detail}>
            <ProTable
              actionRef={subTableRef}
              manualRequest={true}
              headerTitle={
                currentRecord?.dictName ? `【${currentRecord.dictName}】字典项` : '请选择字典'
              }
              columns={[...subTableColumn, optionsColumn]}
              params={{ dictId: currentRecord?.dictId }}
              search={false}
              options={{ reload: false }}
              dateFormatter="string"
              rowKey={(record) => record.itemId}
              pagination={false}
              toolBarRender={(_, { selectedRows, selectedRowKeys }) => {
                const defaultBtns = [
                  <Button
                    disabled={!currentRecord}
                    type="primary"
                    key="primary"
                    onClick={() => {
                      handleAdd(0);
                    }}
                  >
                    <PlusCircleOutlined /> 新增字典项
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
                const res = await queryItemListByParams(params);
                return {
                  data: res,
                  success: true,
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
          </Col>
        </Row>
      </div>
      {editModalVisible && (
        <EditModal
          open={editModalVisible}
          type={editModalType}
          data={currentRecord}
          onCancel={() => {
            setEditModalVisible(false);
          }}
          refresh={() => {
            subTableRef.current.clearSelected();
            subTableRef.current.reload();
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

export default Index;
