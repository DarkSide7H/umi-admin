import { CloseOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Select, Space } from 'antd';
import { cubicleUpdate } from '../services';
const Index = (props) => {
  const { open, roomData = {}, cubicleData = [], cubicleTypeDict = [], onCancel, refresh } = props;
  const [form] = Form.useForm();

  const handleOnOk = async () => {
    const { roomId } = roomData;
    const values = await form.validateFields();
    const res = await cubicleUpdate({ roomId, ...values });
    if (res) {
      message.success('操作成功');
      refresh();
      onCancel();
    }
  };

  return (
    <Modal
      open={open}
      title={'工位编辑'}
      onCancel={onCancel}
      closable={false}
      maskClosable={false}
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
        initialValues={{ cubicleList: cubicleData.length ? cubicleData : [{}] }}
        autoComplete="off"
      >
        <Form.Item>
          <Form.List name="cubicleList">
            {(subFields, subOpt) => (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: 16,
                }}
              >
                {subFields.map((subField) => (
                  <Space key={subField.key}>
                    <Form.Item
                      noStyle
                      name={[subField.name, 'cubicleName']}
                      rules={[
                        {
                          required: true,
                          message: '请填写工位名称',
                        },
                      ]}
                    >
                      <Input style={{ width: '155px' }} placeholder="工位名称" maxLength={120} />
                    </Form.Item>
                    <Form.Item noStyle name={[subField.name, 'cubicleType']}>
                      <Select style={{ width: '140px' }} placeholder="请选择工位类型" allowClear>
                        {cubicleTypeDict.map((item) => (
                          <Select.Option key={item.itemValue} value={item.itemValue}>
                            {item.itemDesc}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item noStyle name={[subField.name, 'siteCode']}>
                      <Input style={{ width: '140px' }} placeholder="场所编码" maxLength={120} />
                    </Form.Item>
                    <Form.Item hidden noStyle name={[subField.name, 'cubicleId']}>
                      <Input placeholder="工位ID" maxLength={120} />
                    </Form.Item>
                    {subFields.length > 1 && (
                      <CloseOutlined
                        onClick={() => {
                          subOpt.remove(subField.name);
                        }}
                      />
                    )}
                  </Space>
                ))}
                <Button type="dashed" style={{ width: '450px' }} onClick={() => subOpt.add()} block>
                  + 添加工位
                </Button>
              </div>
            )}
          </Form.List>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Index;
