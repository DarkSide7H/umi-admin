import { PageContainer } from '@ant-design/pro-components';
import { Alert } from 'antd';
// import Dashboard from './dashboard';

const Home = () => {
  return (
    <PageContainer>
      <Alert message={'交易场地智能总控平台'} type="info" showIcon />
    </PageContainer>
  );
};

export default Home;
