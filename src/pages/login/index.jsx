import '@/assets/captcha/css/tac.css';
import '@/assets/captcha/js/tac.min.js';
import { getCurrentUserInfo } from '@/services/common';
import { CaretDownFilled, LockTwoTone, MobileTwoTone } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Button, Col, Form, Input, Modal, Popover, Radio, Row, Space, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import styles from './index.less';
import { getVenue, login } from './service';

const Login = () => {
  const [form] = Form.useForm();
  const [venues, setVenues] = useState([]);
  const [currentValue, setCurrentValue] = useState(null);
  const [currentVenues, setCurrentVenues] = useState(null);
  const { initialState, setInitialState } = useModel('@@initialState');
  const [chooseVenuesVisible, setChooseVenuesVisible] = useState(false);
  const [captchaVisible, setCaptchaVisible] = useState(false);
  const [captchaInitialized, setCaptchaInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const captchaDivRef = useRef(null);
  const tacRef = useRef(null);

  const fetchUserInfo = async () => {
    const userInfo = await getCurrentUserInfo();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const fetchVenue = async () => {
    const resp = await getVenue();
    setVenues(resp);
    if (resp.length) {
      const localVenueId = localStorage.getItem('venueId');
      if (localVenueId) {
        setCurrentValue(localVenueId);
        setCurrentVenues(resp.find((v) => v.venueId === localVenueId));
      } else {
        setCurrentValue(resp[0]?.venueId);
        setCurrentVenues(resp[0]);
      }
    }
  };

  useEffect(() => {
    fetchVenue();
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true); // 开始加载
    try {
      const data = await login({ venueId: currentValue, ...values });
      localStorage.setItem('token', data);
      if (data) {
        fetchUserInfo().then(() => {
          setInitialState((s) => ({
            ...s,
            token: data,
          }));
          const urlParams = new URL(window.location.href).searchParams;
          history.push(urlParams.get('redirect') || '/');
        });
        localStorage.setItem('venueId', currentValue);
      }
    } finally {
      setLoading(false); // 结束加载
    }
  };

  const chooseVenues = () => {
    setChooseVenuesVisible(true);
  };
  const onChange = (e) => {
    const val = e.target.value;
    setCurrentValue(val);
    setCurrentVenues(venues.find((v) => v.venueId === val));
  };

  const validCaptcha = () => {
    if (tacRef.current) {
      tacRef.current.destroyWindow();
    }
    const config = {
      requestCaptchaDataUrl: `${API_HOST}/api/inside/front/captcha/genCaptcha`,
      validCaptchaUrl: `${API_HOST}/api/inside/front/captcha/check`,
      bindEl: '#captcha-div',
      validSuccess: (res, c, tac) => {
        form.setFieldsValue({ captchaId: res.data.id });
        form.submit();
        tac.destroyWindow();
        setCaptchaVisible(false);
      },
    };
    tacRef.current = new window.TAC(config).init();
  };

  const handleCaptchaVisibleChange = (visible) => {
    setCaptchaVisible(visible);
    if (visible) {
      setCaptchaInitialized(false);
    }
  };

  useEffect(() => {
    if (captchaVisible && !captchaInitialized) {
      validCaptcha();
      setCaptchaInitialized(true);
    }
  }, [captchaVisible, captchaInitialized]);

  return (
    <div className={styles.container}>
      <Row align="middle">
        <Col span={16} className={styles.left}>
          <div className={styles.header}>
            <img className={styles.logo} src="./../../assets/logo.png" alt="logo" />
            <div>
              <div className={styles.title}>交易场地智能总控平台</div>
              <div className={styles.subtitle}>InterlliVenue Venue Management Platform</div>
            </div>
          </div>
          <div className={styles.footer}>
            技术支持：四川亚创信息技术有限公司 服务热线：028-85921850
          </div>
        </Col>
        <Col span={8} className={styles.right}>
          <Spin spinning={loading} size="large" delay={500} tip="登录中...">
            <Form form={form} className={styles.form} size="large" onFinish={handleSubmit}>
              <h1>登录</h1>
              {venues.length === 1 && (
                <h2 style={{ padding: '10px 0 ' }}>{currentVenues?.venueNameCn}</h2>
              )}
              {venues.length > 1 && (
                <h2 style={{ padding: '10px 0 ' }} onClick={() => chooseVenues()}>
                  {currentVenues?.venueNameCn}
                  <Button type="link">
                    <CaretDownFilled />
                  </Button>
                </h2>
              )}
              <Form.Item name="username" rules={[{ required: true, message: '请输入用户名!' }]}>
                <Input placeholder="请输入用户名登录" maxLength={30} prefix={<MobileTwoTone />} />
              </Form.Item>

              <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
                <Input.Password placeholder="请输入密码" maxLength={30} prefix={<LockTwoTone />} />
              </Form.Item>

              <Form.Item name="captchaId" style={{ display: 'none' }}>
                <Input type="hidden" />
              </Form.Item>

              <Form.Item>
                <Popover
                  content={<div id="captcha-div" ref={captchaDivRef} />}
                  trigger="click"
                  visible={captchaVisible}
                  onVisibleChange={handleCaptchaVisibleChange}
                  overlayClassName={styles.noPopoverPadding}
                >
                  <Button size="large" type="primary" block loading={loading}>
                    登录
                  </Button>
                </Popover>
              </Form.Item>
            </Form>
          </Spin>
        </Col>
      </Row>
      <Modal
        title="请选择要登录的场地"
        open={chooseVenuesVisible}
        okText="确认"
        cancelText="取消"
        closable={false}
        onOk={() => setChooseVenuesVisible(false)}
        onCancel={() => setChooseVenuesVisible(false)}
      >
        <Radio.Group
          style={{ margin: '10px 0' }}
          size="large"
          onChange={onChange}
          value={currentValue}
        >
          <Space direction="vertical">
            {venues.map((v) => (
              <Radio key={v.venueId} value={v.venueId} style={{ fontSize: '16px' }}>
                {v.venueNameCn}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Modal>
    </div>
  );
};

export default Login;
