// import { ExpandableDescriptions } from '@/components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Descriptions, Drawer, Tag } from 'antd';
import styles from './../index.less';

const Index = (props) => {
  const {
    open,
    data = {},
    areaData = {},
    cubicleData = [],
    roomGateData = [],
    renderRoomType,
    renderCubicleType,
    onClose,
    handleCubiCle,
    handleGate,
  } = props;

  const tableColumn = [
    {
      title: '序号',
      render: (_, record, index) => index + 1,
    },
    {
      title: '名称',
      dataIndex: 'cubicleName',
    },
    {
      title: '类型',
      dataIndex: 'cubicleType',
      render: (val) => renderCubicleType(val),
    },
    {
      title: '场所编码',
      dataIndex: 'siteCode',
    },
  ];

  return (
    <Drawer
      open={open}
      closable={false}
      onClose={() => {
        onClose();
      }}
      width={600}
    >
      <Descriptions labelStyle={{ width: '100px' }} title="房间信息" column={2}>
        <Descriptions.Item label="房间名称">{data?.roomName}</Descriptions.Item>
        <Descriptions.Item label="场所编码">{data?.siteCode}</Descriptions.Item>
        <Descriptions.Item label="房间类型">{renderRoomType(data?.roomType)}</Descriptions.Item>
        <Descriptions.Item label="所属区域">{areaData?.areaName}</Descriptions.Item>
        {data?.remarks && <Descriptions.Item label="备注">{data.remarks}</Descriptions.Item>}
      </Descriptions>
      <Descriptions
        title={`出入口（${roomGateData.length}）`}
        column={1}
        extra={
          <Button key="cubicle" type="link" onClick={() => handleGate()}>
            设置
          </Button>
        }
      >
        <Descriptions.Item>
          {roomGateData.map((v, index) => (
            <Tag key={index}>{v.gateName}</Tag>
          ))}
        </Descriptions.Item>
      </Descriptions>
      {/** {open && <ExpandableDescriptions data={data} />} */}
      <div className={styles.table}>
        <ProTable
          headerTitle={`工位（${cubicleData.length}）`}
          toolBarRender={() => [
            <Button key="cubicle" type="link" onClick={() => handleCubiCle()}>
              设置
            </Button>,
          ]}
          bordered
          size="small"
          search={false}
          options={false}
          pagination={false}
          dataSource={cubicleData}
          columns={tableColumn}
        />
      </div>
    </Drawer>
  );
};

export default Index;
