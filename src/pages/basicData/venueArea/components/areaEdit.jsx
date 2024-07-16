import { Button, Form, Input, InputNumber, message, Modal, Select, TreeSelect } from 'antd';
import { addArea, updateArea } from '../services';

const Index = (props) => {
  const { open, type, data = {}, areaTypeDict = [], treeData = [], refresh, onCancel } = props;
  const [form] = Form.useForm();

  const handleOnOk = async () => {
    const values = await form.validateFields();
    values.parentId = values.parentId || '-1';
    if (type) {
      const { areaId } = data;
      // 修改
      const res = await updateArea({ areaId, ...values });
      if (res) {
        message.success('修改区域成功');
        refresh();
        onCancel();
      }
    } else {
      // 新增
      const res = await addArea(values);
      if (res) {
        message.success('添加区域成功');
        refresh();
        onCancel();
      }
    }
  };

  return (
    <Modal
      open={open}
      title={type ? `区域编辑 - ${data.areaName}` : '新增区域'}
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
          parentId: type ? (data?.parentId === '-1' ? '' : data?.parentId) : '',
          areaName: type ? data?.areaName : '',
          areaType: type ? data?.areaType : '',
          siteCode: type ? data?.siteCode : '',
          sortNo: type ? data?.sortNo : '',
          remarks: type ? data?.remarks : '',
        }}
        autoComplete="off"
      >
        <Form.Item label="父级区域" name={'parentId'}>
          <TreeSelect treeDefaultExpandAll treeData={treeData} allowClear />
        </Form.Item>
        <Form.Item
          name="areaName"
          label={'区域名称'}
          rules={[
            {
              required: true,
              message: '请填写区域名称',
            },
          ]}
        >
          <Input placeholder="请输入区域名称" maxLength={120} />
        </Form.Item>
        <Form.Item label="区域类型" name={'areaType'}>
          <Select placeholder="请选择区域类型" allowClear>
            {areaTypeDict.map((item) => (
              <Select.Option key={item.itemValue} value={item.itemValue}>
                {item.itemDesc}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="siteCode" label={'场所编码'}>
          <Input placeholder="请输入场所编码" maxLength={120} />
        </Form.Item>
        <Form.Item name="sortNo" label={'排序号'}>
          <InputNumber style={{ width: '100%' }} placeholder="请输入排序号" min={0} max={999} />
        </Form.Item>
        <Form.Item name="remarks" label={'备注'}>
          <Input.TextArea showCount rows={4} placeholder="请输入备注" maxLength={200} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Index;
