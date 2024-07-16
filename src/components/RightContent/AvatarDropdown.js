import { changePwd, loginOut } from '@/services/common';
import { LogoutOutlined, UnlockOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Button, Form, Input, Modal, Spin, Tag } from 'antd';
import { createStyles } from 'antd-style';
import { stringify } from 'querystring';
import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  return <span className="anticon">{currentUser?.userInfo?.username}</span>;
};

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
  };
});

export const AvatarDropdown = ({ children }) => {
  const [form] = Form.useForm();
  const [pwdModalVisible, setPwdModalVisible] = useState(false);

  const fetchLoginOut = async () => {
    await loginOut();
    localStorage.removeItem('token');
    const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    const redirect = urlParams.get('redirect');
    if (window.location.pathname !== '/login' && !redirect) {
      history.replace({
        pathname: '/login',
        search: stringify({
          redirect: pathname + search,
        }),
      });
    }

    localStorage.removeItem('token');
  };

  const { styles } = useStyles();
  const { initialState, setInitialState } = useModel('@@initialState');

  useEffect(() => {
    if (currentUser?.userInfo?.initPwd) {
      setPwdModalVisible(true);
    }
  }, [currentUser]);

  const onMenuClick = useCallback(
    (event) => {
      const { key } = event;
      if (key === 'logout') {
        flushSync(() => {
          setInitialState((s) => ({ ...s, currentUser: undefined }));
        });
        fetchLoginOut();
        return;
      }
      if (key === 'changePwd') {
        setPwdModalVisible(true);
        return;
      }
    },
    [setInitialState],
  );

  const loading = (
    <span className={styles.action}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser?.userInfo?.username) {
    return loading;
  }

  const menuItems = [
    {
      key: 'changePwd',
      icon: <UnlockOutlined />,
      label: '修改密码',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const handleOnOk = async () => {
    const values = await form.validateFields();
    const res = await changePwd({ userId: currentUser.userInfo.userId, ...values });
    if (res) {
      form.resetFields();
      setPwdModalVisible(false);
      Modal.success({
        content: '密码修改成功，请重新登录系统',
        okText: '去登录',
        onOk: () => {
          fetchLoginOut();
        },
      });
    }
  };

  const handleOnCancel = () => {
    form.resetFields();
    setPwdModalVisible(false);
  };

  return (
    <>
      <HeaderDropdown
        menu={{
          selectedKeys: [],
          onClick: onMenuClick,
          items: menuItems,
        }}
      >
        {children}
      </HeaderDropdown>
      <Modal
        maskClosable={false}
        open={pwdModalVisible}
        title={
          <>
            修改密码
            {currentUser?.userInfo?.initPwd && (
              <Tag bordered={false} color="warning">
                您的密码是初始密码，为保障您的信息安全请尽快修改
              </Tag>
            )}
          </>
        }
        onCancel={handleOnCancel}
        clearOnDestroy
        footer={[
          <Button key="submit" type="primary" onClick={handleOnOk}>
            确认
          </Button>,
          <Button key="back" type="dashed" onClick={handleOnCancel}>
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
          autoComplete="off"
        >
          <Form.Item
            name={'oldPassword'}
            label={'原密码'}
            rules={[
              {
                required: true,
                message: '请填写原密码',
              },
            ]}
          >
            <Input.Password placeholder="请填写原密码" maxLength={30} />
          </Form.Item>
          <Form.Item
            name={'newPassword'}
            label={'新密码'}
            rules={[
              {
                required: true,
                message: '请填写新密码',
              },
            ]}
          >
            <Input.Password placeholder="请填写新密码" maxLength={30} />
          </Form.Item>
          <Form.Item
            name={'confirmPassword'}
            label={'密码确认'}
            dependencies={['newPassword']}
            rules={[
              {
                required: true,
                message: '请填写新密码',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请填写新密码" maxLength={30} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
