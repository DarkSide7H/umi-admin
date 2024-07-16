import { transformToTreeData } from '@/utils/shared';
import { useModel } from '@umijs/max';
import { Button, Form, Input, message, Modal, Select, TreeSelect } from 'antd';
import { useEffect, useState } from 'react';
import { addDepart, getDepartTree, updateDepart } from '../services';

const OrgEdit = (props) => {
  const { open, type, orgData, onCancel, refresh, departmentType = [] } = props;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  const { venueId } = currentUser;
  const { departId = '' } = orgData || {};

  const [form] = Form.useForm();
  const [treeData, setTreeData] = useState([]);

  const fetchDepartTree = async () => {
    const data = await getDepartTree();
    setTreeData(transformToTreeData(data));
  };

  useEffect(() => {
    fetchDepartTree();
  }, []);

  const handleOnOk = async () => {
    const values = await form.validateFields();
    if (type) {
      // 修改
      const res = await updateDepart({ departId, ...values });
      if (res) {
        message.success('修改部门成功');
        refresh();
        onCancel();
      }
    } else {
      // 新增
      const res = await addDepart({ venueId, ...values });
      if (res) {
        message.success('添加部门成功');
        refresh();
        onCancel();
      }
    }
  };

  return (
    <Modal
      open={open}
      title={type ? `部门编辑 - ${orgData?.departName}` : '新增部门'}
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
          parentId: type ? orgData?.parentId : orgData?.departId ?? '',
          departName: type ? orgData?.departName : '',
          shortName: type ? orgData?.shortName : '',
          departType: type ? orgData?.departType : '',
        }}
        autoComplete="off"
      >
        <Form.Item label="上级部门" name={'parentId'}>
          <TreeSelect treeDefaultExpandAll treeData={treeData} allowClear />
        </Form.Item>
        <Form.Item
          name="departName"
          label={'部门名称'}
          rules={[
            {
              required: true,
              message: '请填写部门名称',
            },
          ]}
        >
          <Input placeholder="请输入部门名称" maxLength={100} />
        </Form.Item>
        <Form.Item name="shortName" label={'部门简称'}>
          <Input placeholder="请输入部门简称" maxLength={100} />
        </Form.Item>
        <Form.Item name="departType" label="部门类型">
          <Select placeholder="请选择部门类型">
            {departmentType.map((item) => (
              <Select.Option key={item.itemValue} value={item.itemValue}>
                {item.itemDesc}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OrgEdit;
