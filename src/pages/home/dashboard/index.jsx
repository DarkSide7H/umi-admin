import { Pie } from '@ant-design/plots';

const Index = () => {
  const data = [
    {
      type: '已入场',
      value: 50,
    },
    {
      type: '未入场',
      value: 20,
    },
  ];
  const config = {
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      text: (d) => `${d.type}\n ${d.value}`,
      position: 'spider',
    },
    legend: {
      color: {
        title: false,
        position: 'right',
        rowPadding: 5,
      },
    },
  };
  return (
    <div style={{ width: '400px', height: '400px' }}>
      <Pie {...config} />
    </div>
  );
};

export default Index;
