import { ExpandableDescriptions } from '@/components';
import { Descriptions, Drawer } from 'antd';

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
      <Descriptions column={1} labelStyle={{ width: '120px' }} title="字典项信息">
        <Descriptions.Item label="字典项值">{data.itemValue}</Descriptions.Item>
        <Descriptions.Item label="字典项描述">{data.itemDesc}</Descriptions.Item>
        <Descriptions.Item label="排序号">{data.sortNo}</Descriptions.Item>
      </Descriptions>
      {open && <ExpandableDescriptions data={data} />}
    </Drawer>
  );
};

export default Index;
