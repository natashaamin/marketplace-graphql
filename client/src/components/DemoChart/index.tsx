import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';

const DemoChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    asyncFetch();
  }, []);

  // example json: https://gw.alipayobjects.com/os/bmw-prod/55424a73-7cb8-4f79-b60d-3ab627ac5698.json
  const asyncFetch = () => {
    fetch('/api/marketplace/getItems')
      .then((response) => response.json())
      .then((json) => {
        setLoading(false)
        setData(json)
      })
      .catch((error) => {
        console.error('fetch data failed', error);
      });
  };

  const config = {
    data,

    xField: 'time',
    yField: 'pricePerMWh',
    stepType: 'vh',
  };

  return <Line {...config} loading={loading} />;
};

export default DemoChart;
