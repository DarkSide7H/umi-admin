import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useRef } from 'react';
import { tableColumn } from './fields';
import { queryMenuTree } from './services';

const Index = () => {
  const actionRef = useRef();
  return (
    <PageContainer title={false}>
      <ProTable
        actionRef={actionRef}
        headerTitle="菜单列表"
        columns={tableColumn}
        params={{}}
        search={false}
        options={{ reload: false, search: false }}
        dateFormatter="string"
        rowKey={(record) => record.menuId}
        pagination={false}
        request={async (params = {}) => {
          const res = await queryMenuTree({
            ...params,
          });
          return {
            data: res,
            success: true,
          };
        }}
        tableAlertRender={false}
      />
    </PageContainer>
  );
};

export default Index;
