import { ExpandableDescriptions } from '@/components';
import { Descriptions, Drawer, Tag } from 'antd';
import { ROLE_TYPE } from '../fields';

const Index = (props) => {
  const { open, data = {}, onClose } = props;

  return (
    <Drawer
      open={open}
      closable={false}
      onClose={() => {
        onClose();
      }}
    >
      <Descriptions labelStyle={{ width: '120px' }} title="角色信息" column={1}>
        <Descriptions.Item label="角色编码">{data.roleCode}</Descriptions.Item>
        <Descriptions.Item label="角色名称">{data.roleName}</Descriptions.Item>
        <Descriptions.Item label="角色类型">
          <Tag>{ROLE_TYPE[data.roleType]}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="角色类型描述">{data.roleTypeDesc}</Descriptions.Item>
        <Descriptions.Item label="备注">{data.remarks}</Descriptions.Item>
      </Descriptions>
      {open && <ExpandableDescriptions data={data} />}
    </Drawer>
  );
};

export default Index;
