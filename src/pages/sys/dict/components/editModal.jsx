import { Button, Form, Input, InputNumber, message, Modal } from 'antd';
import { addItem, updateItem } from '../services';

const Index = (props) => {
  const { open, type, data, onCancel, refresh } = props;
  const [form] = Form.useForm();

  const handleOnOk = async () => {
    const values = await form.validateFields();
    if (type) {
      const { itemId } = data;
      // 修改
      const res = await updateItem({ itemId, ...values });
      if (res) {
        message.success('修改字典成功');
        refresh();
        onCancel();
      }
    } else {
      const { dictId, venueId } = data;
      // 新增
      const res = await addItem({ dictId, venueId, ...values });
      if (res) {
        message.success('添加字典成功');
        refresh();
        onCancel();
      }
    }
  };

  return (
    <Modal
      open={open}
      title={type ? `字典项编辑 - ${data?.itemDesc}` : '新增字典项'}
      onCancel={onCancel}
      footer={[
        <Button key="submit" type="primary" onClick={() => handleOnOk()}>
          确认
        </Button>,
        <Button key="back" type="dashed" onClick={onCancel}>
          取消
        </Button>,
      ]}
    >
      <Form
        form={form}
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          itemValue: type ? data?.itemValue : '',
          itemDesc: type ? data?.itemDesc : '',
          sortNo: type ? data?.sortNo : '',
        }}
        autoComplete="off"
      >
        <Form.Item
          name="itemValue"
          label={'字典项值'}
          rules={[
            {
              required: true,
              message: '请填写字典项值',
            },
          ]}
        >
          <Input placeholder="请输入字典项值" maxLength={100} />
        </Form.Item>
        <Form.Item
          name="itemDesc"
          label={'字典描述'}
          rules={[
            {
              required: true,
              message: '请填写字典描述',
            },
          ]}
        >
          <Input placeholder="请输入字典描述" maxLength={100} />
        </Form.Item>
        <Form.Item name="sortNo" label={'排序'}>
          <InputNumber placeholder="请输入字典描述" min={0} max={999} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Index;
