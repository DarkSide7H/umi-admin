import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Descriptions } from 'antd';
import { useState } from 'react';

/**
 * 更多详细信息
 * @param { data, children }
 * @returns
 */
const ExpandableDescriptions = ({ data, children }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      {showMore && (
        <Descriptions column={1} labelStyle={{ width: '120px' }}>
          {children}
          <Descriptions.Item label="创建人">{data.createByNm || '-'}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{data.createTime || '-'}</Descriptions.Item>
          <Descriptions.Item label="更新人">{data.updateByNm || '-'}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{data.updateTime || '-'}</Descriptions.Item>
        </Descriptions>
      )}
      <Descriptions.Item style={{ textAlign: 'center' }}>
        <Button
          size="small"
          type="text"
          style={{ color: 'grey' }}
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? (
            <>
              收起 <UpOutlined />
            </>
          ) : (
            <>
              展开更多... <DownOutlined />
            </>
          )}
        </Button>
      </Descriptions.Item>
    </>
  );
};

export default ExpandableDescriptions;
