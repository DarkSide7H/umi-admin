import { defaultPagination } from '@/constants';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useRef } from 'react';
import { tableColumn } from './fields';
import { pageLogInfo } from './services';

const Index = () => {
  const actionRef = useRef();
  return (
    <PageContainer title={false}>
      <ProTable
        actionRef={actionRef}
        headerTitle="操作日志列表"
        columns={tableColumn}
        params={{}}
        search={false}
        options={{ reload: false, search: { allowClear: true, placeholder: '请输入关键字检索' } }}
        dateFormatter="string"
        rowKey={(record) => record.logId}
        pagination={defaultPagination}
        request={async (params = {}) => {
          const res = await pageLogInfo({
            ...params,
          });
          return {
            data: res.records,
            success: true,
            total: res.total,
          };
        }}
        tableAlertRender={false}
      />
    </PageContainer>
  );
};

export default Index;
