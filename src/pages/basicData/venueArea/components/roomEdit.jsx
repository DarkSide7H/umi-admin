import { Button, Form, Input, message, Modal, Select } from 'antd';
import { addRoom, updateRoom } from '../services';

const Index = (props) => {
  const { open, type, data = {}, areaData, roomTypeDict = [], refresh, onCancel } = props;
  const [form] = Form.useForm();

  const handleOnOk = async () => {
    const values = await form.validateFields();
    if (type) {
      // 修改
      const { roomId } = data;
      const res = await updateRoom({ roomId, ...values });
      if (res) {
        message.success('修改房间成功');
        refresh();
        onCancel();
      }
    } else {
      // 新增
      const res = await addRoom(values);
      if (res) {
        message.success('添加房间成功');
        refresh();
        onCancel();
      }
    }
  };

  return (
    <Modal
      open={open}
      title={type ? `房间编辑 - ${data.roomName}` : '新增房间'}
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
        className="mt-5"
        initialValues={{
          areaId: areaData?.areaId,
          roomName: type ? data?.roomName : '',
          roomType: type ? data?.roomType : '',
          siteCode: type ? data?.siteCode : '',
          remarks: type ? data?.remarks : '',
        }}
        autoComplete="off"
      >
        <Form.Item label="所属区域" name={'areaId'} hidden>
          <Input placeholder="请输入所属区域" maxLength={120} />
        </Form.Item>
        <Form.Item
          name="roomName"
          label={'房间名称'}
          rules={[
            {
              required: true,
              message: '请填写房间名称',
            },
          ]}
        >
          <Input placeholder="请输入房间名称" maxLength={120} />
        </Form.Item>
        <Form.Item name="roomType" label="房间类型">
          <Select placeholder="请选择房间类型" allowClear>
            {roomTypeDict.map((item) => (
              <Select.Option key={item.itemValue} value={item.itemValue}>
                {item.itemDesc}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="siteCode" label={'场所编码'}>
          <Input placeholder="请输入场所编码" maxLength={120} />
        </Form.Item>
        <Form.Item name="remarks" label={'备注'}>
          <Input.TextArea showCount rows={4} placeholder="请输入备注" maxLength={200} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Index;
