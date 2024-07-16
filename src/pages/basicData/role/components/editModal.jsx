import { Button, Form, Input, message, Modal } from 'antd';
import { addRole, updateRole } from '../services';

const Index = (props) => {
  const { open, type, data, onCancel, refresh } = props;
  const [form] = Form.useForm();

  const handleOnOk = async () => {
    const values = await form.validateFields();
    if (type) {
      const { roleId } = data;
      // 修改
      const res = await updateRole({ roleId, ...values });
      if (res) {
        message.success('修改角色成功');
        refresh();
        onCancel();
      }
    } else {
      // 新增
      const res = await addRole(values);
      if (res) {
        message.success('添加角色成功');
        refresh();
        onCancel();
      }
    }
  };

  return (
    <Modal
      open={open}
      title={type ? `角色编辑 - ${data?.roleName}` : '新增角色'}
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
          roleCode: type ? data?.roleCode : '',
          roleName: type ? data?.roleName : '',
          remarks: type ? data?.remarks : '',
        }}
        autoComplete="off"
      >
        <Form.Item
          name="roleName"
          label={'角色名称'}
          rules={[
            {
              required: true,
              message: '请填写角色名称',
            },
          ]}
        >
          <Input placeholder="请输入角色名称" maxLength={100} />
        </Form.Item>
        <Form.Item
          name="roleCode"
          label={'角色编码'}
          rules={[
            {
              required: true,
              message: '请填写角色编码',
            },
          ]}
        >
          <Input placeholder="请输入角色编码" maxLength={100} />
        </Form.Item>
        <Form.Item name="remarks" label={'备注'}>
          <Input.TextArea showCount rows={4} placeholder="请输入备注" maxLength={200} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Index;
