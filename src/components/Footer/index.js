import { DefaultFooter } from '@ant-design/pro-components';

const Footer = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright="scyachuang. All Right Reserved  备案号：蜀ICP备11009002号-1"
      links={[
        {
          key: 'scyc',
          title: '技术支持：四川亚创信息技术有限公司 服务热线：028-85921850',
          href: 'http://www.scyachuang.com.cn/',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
