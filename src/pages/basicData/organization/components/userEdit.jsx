import { FileUpload } from '@/components'; // 引入文件上传组件
import { batchDel, queryAvailItemList } from '@/services/common';
import { fullFileUrl } from '@/utils/shared';
import { Button, Form, Input, message, Modal, Radio, Select, Switch, TreeSelect } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useEffect, useState } from 'react';
import { addUser, updateUser } from '../services';

const Index = (props) => {
  const { open, type, orgData, treeData, onCancel, userData, roles = [], refresh } = props;
  const [form] = Form.useForm();
  const [genderType, setGenderType] = useState([]);
  const [delIds, setDelIds] = useState([]);

  const getGenderType = async () => {
    const res = await queryAvailItemList({ dictCode: 'gender_type' });
    setGenderType(res);
  };

  useEffect(() => {
    getGenderType();
  }, []);

  useEffect(() => {
    if (type && userData?.photoList) {
      const list = userData.photoList.map((v) => ({
        fileId: v.fileId,
        id: v.fileId,
        uid: v.fileId,
        url: fullFileUrl(v.fileUrl),
      }));
      setFileList(list);
    }
  }, [type, userData]);

  const handleOnOk = async () => {
    const values = await form.validateFields();
    values.photoIds = fileList.map((v) => v.fileId);
    values.status = values.status ? 1 : 2;
    if (type) {
      const { userId } = userData;
      // 修改
      const res = await updateUser({ userId, ...values });
      if (res) {
        message.success('修改员工成功');
        refresh();
        onCancel();
      }
    } else {
      // 新增
      const res = await addUser(values);
      if (res) {
        message.success('添加员工成功');
        refresh();
        onCancel();
      }
    }
    delIds.length > 0 && batchDel(delIds);
  };

  const handleOnCancel = () => {
    delDirtyFiles();
    onCancel();
  };

  // 删除文件脏数据，设计存疑
  const delDirtyFiles = () => {
    const currentPhotoIds = fileList.map((v) => v.fileId);
    let realDirty = [...delIds, ...currentPhotoIds];
    if (realDirty.length) {
      if (type) {
        const userPhotoIds = (userData.photoList || []).map((v) => v.fileId);
        realDirty = realDirty.filter((id) => !userPhotoIds.includes(id));
      }
      realDirty.length > 0 && batchDel(realDirty);
    }
  };

  const [fileList, setFileList] = useState([]);
  const onChange = (files, delImgs) => {
    setFileList(files);
    setDelIds(delImgs);
  };

  const roleList = () => {
    if (userData?.userRoleList) {
      return userData.userRoleList.map((v) => v.roleId);
    }
    return [];
  };

  return (
    <Modal
      maskClosable={false}
      open={open}
      title={type ? `员工编辑 - ${userData?.username}` : '新增员工'}
      onCancel={handleOnCancel}
      footer={[
        <Button key="submit" type="primary" onClick={() => handleOnOk()}>
          确认
        </Button>,
        <Button key="back" type="dashed" onClick={() => handleOnCancel()}>
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
          departId: orgData.departId,
          username: type ? userData?.username : '',
          realName: type ? userData?.realName : '',
          idCard: type ? userData?.idCard : '',
          mobile: type ? userData?.mobile : '',
          telphone: type ? userData?.telphone : '',
          gender: type ? userData?.gender : '',
          roleIdList: type ? roleList() : undefined,
          status: type ? userData?.status === 1 : false,
        }}
        autoComplete="off"
      >
        <Form.Item label="所属部门" name={'departId'}>
          <TreeSelect
            allowClear
            treeDefaultExpandAll
            treeData={treeData}
            placeholder="请选择所属上级部门"
          />
        </Form.Item>

        <Form.Item
          name={'username'}
          label={'登录用户名'}
          rules={[
            {
              required: true,
              message: '请填写登录用户名',
            },
          ]}
        >
          <Input placeholder="请填写登录用户名" maxLength={30} />
        </Form.Item>
        <Form.Item
          name={'realName'}
          label={'姓名'}
          rules={[
            {
              required: true,
              message: '请填写姓名',
            },
          ]}
        >
          <Input placeholder="请填写姓名" maxLength={30} />
        </Form.Item>
        <Form.Item name={'gender'} label={'性别'}>
          <Radio.Group optionType="button">
            {genderType.map((v) => (
              <Radio key={v.itemValue} value={v.itemValue}>
                {v.itemDesc}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name={'idCard'}
          label={'身份证号'}
          rules={[
            {
              required: true,
              message: '请填写身份证号码',
            },
            {
              pattern:
                /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])\d{3}(\d|X)$/,
              message: '请输入有效的身份证号码',
            },
          ]}
        >
          <Input placeholder="请填写身份证号码" maxLength={18} />
        </Form.Item>
        <Form.Item
          name={'mobile'}
          label={'手机号码'}
          rules={[
            {
              required: true,
              message: '请填写手机号码',
            },
            {
              pattern: /^1[3-9]\d{9}$/,
              message: '请输入正确的号码格式',
            },
          ]}
        >
          <Input placeholder="请填写手机号码" maxLength={11} />
        </Form.Item>
        <Form.Item
          name={'telphone'}
          label={'联系电话'}
          rules={[
            {
              pattern: /^(\d{3,4}-)?\d{7,8}$/,
              message: '请输入有效的联系电话',
            },
          ]}
        >
          <Input placeholder="请填写联系电话" maxLength={11} />
        </Form.Item>
        <Form.Item name="roleIdList" label="角色">
          <Select mode="multiple" placeholder="请选择角色">
            {roles.map((v) => (
              <Select.Option key={v.roleId} value={v.roleId}>
                {v.roleName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name={'status'} label="是否可登录系统" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name={'photoIds'} label="照片">
          <ImgCrop rotationSlider>
            <FileUpload
              maxCount={1}
              accept=".png,.jpg,.jpeg"
              listType="picture-card"
              onChange={onChange}
              fileList={fileList}
            ></FileUpload>
          </ImgCrop>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Index;
