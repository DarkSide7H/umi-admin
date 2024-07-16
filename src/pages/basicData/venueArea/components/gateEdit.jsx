import { ArrowDownOutlined, ArrowUpOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Space } from 'antd';
import { gateUpdate } from '../services';

const Index = (props) => {
  const { open, belongTo, gateData = [], onCancel, refresh } = props;
  const [form] = Form.useForm();

  const handleOnOk = async () => {
    const values = await form.validateFields();
    const res = await gateUpdate({ belongTo, ...values });
    if (res) {
      message.success('操作成功');
      refresh();
      onCancel();
    }
  };

  return (
    <Modal
      open={open}
      title={'出入口编辑'}
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
        initialValues={{ gateList: gateData.length ? gateData : [{}] }}
        autoComplete="off"
      >
        <Form.Item>
          <Form.List name="gateList">
            {(subFields, subOpt) => (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: 16,
                }}
              >
                {subFields.map((subField, index) => (
                  <Space key={subField.key} align="baseline">
                    <Form.Item
                      noStyle
                      name={[subField.name, 'gateName']}
                      rules={[
                        {
                          required: true,
                          message: '请填写出入口名称',
                        },
                      ]}
                    >
                      <Input style={{ width: '180px' }} placeholder="出入口名称" maxLength={120} />
                    </Form.Item>
                    <Form.Item noStyle name={[subField.name, 'siteCode']}>
                      <Input style={{ width: '160px' }} placeholder="场所编码" maxLength={120} />
                    </Form.Item>
                    <Form.Item hidden noStyle name={[subField.name, 'gateId']}>
                      <Input placeholder="出入口ID" maxLength={120} />
                    </Form.Item>
                    <Space size="large">
                      {index > 0 && (
                        <ArrowUpOutlined
                          onClick={() => {
                            subOpt.move(index, index - 1);
                          }}
                        />
                      )}
                      {index < subFields.length - 1 && (
                        <ArrowDownOutlined
                          onClick={() => {
                            subOpt.move(index, index + 1);
                          }}
                        />
                      )}
                      {subFields.length > 1 && (
                        <CloseOutlined
                          onClick={() => {
                            subOpt.remove(subField.name);
                          }}
                        />
                      )}
                    </Space>
                  </Space>
                ))}
                <Button type="dashed" style={{ width: '455px' }} onClick={() => subOpt.add()} block>
                  + 添加出入口
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
