import { useAuth } from '@/hooks/useAuth';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import React, { useEffect, useState } from 'react';
import DemoHistoryChart from '../DemoHistoryChart';
import { formatDateTimeCustom } from '@/utils/util';

const AuctionResultTable = ({ bidsData, historyData }: any) => {
  const { authToken } = useAuth();
  const [data, setData] = useState();
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    setData(bidsData);
    setChartData(historyData)
  },[bidsData, historyData])

  const columns: ProColumns<API.IHistoryItems>[] = [
    {
      title: 'Bid Id',
      dataIndex: 'bidId',
      render: (_) => <a>{_}</a>,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
    },
    {
      title: 'Start Time',
      key: 'startTime',
      dataIndex: 'startTime',
      valueType: 'time',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: 'Close Time',
      key: 'closeTime',
      dataIndex: 'closeTime',
      valueType: 'time',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: 'TimeRange',
      dataIndex: 'created_at',
      valueType: 'timeRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            closeTime: value[1],
          };
        },
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      valueType: 'money',
      onFilter: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      hideInSearch: true,
      filters: true,
      onFilter: true,
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        REJECTED: {
          text: 'Rejected',
          status: 'Error',
        },
        ACCEPTED: {
          text: 'Accepted',
          status: 'Success',
          disabled: true,
        },
        PENDING: {
          text: 'Pending',
          status: 'processing',
        },
      },
    },
    {
      title: 'Final Price',
      dataIndex: 'finalPrice',
      valueType: 'money',
      onFilter: true,
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return entity?.transactionDetails?.finalPrice || "-"
      },
    },
    {
      title: 'Quantity Sold',
      dataIndex: 'quantitySold',
      valueType: 'digit',
      onFilter: true,
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return entity?.transactionDetails?.quantitySold || "-"
      },
    },
    {
      title: 'Sale Time',
      dataIndex: 'saleTime',
      valueType: 'date',
      hideInSearch: true,
      onFilter: true,
      render(dom, entity, index, action, schema) {
        return formatDateTimeCustom(entity?.transactionDetails?.saleTime) || "-"
      },
    },
  ];


  useEffect(() => {
    let isMounted = true;

    fetch("/api/marketplace/getTotalTransactions", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
    })
        .then(response => {
            if (response.status === 401) {
                if (isMounted) history.replace("/login");
            }
            return response.json();
        })
        .then(data => {
            if (isMounted && data.data.length != 0) {
               setChartData(data.data)
            }
        })
        .catch(error => {
            if (isMounted) console.error('Error:', error);
        });

    return () => {
        isMounted = false; 
    }
}, [authToken, history, bidsData]);

  return (
    <>
      {(chartData?.length !== 0) && <DemoHistoryChart historyData={chartData} />}
      <ProTable<API.IHistoryItems>
        columns={columns}
        dataSource={data}
        headerTitle="Result"
        rowKey="key"
        request={async (params, sort, filter) => {
          const queryString = new URLSearchParams(params).toString();
          const url = `/apimarketplace/getHistory?${queryString}`;

          try {
            const response = await fetch(url, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
              },
            });

            if (response.status === 401) {
              history.replace("/login");
            }

            if (!response.ok) {
              throw new Error('Network response was not ok');
            }

            const result = await response.json();
            setData(result.data);
            return {
              data: result.data,
              success: true
            };
          } catch (error) {
            console.error('Fetch error:', error);
            return {
              data: [],
              success: false
            };
          }
        }}
        pagination={{
          showQuickJumper: true,
        }}
        options={false}
        dateFormatter="string"
        onSubmit={(params) => {
          console.log(params);
        }}
        search={{
          labelWidth: 'auto',
        }} /></>
  );
};

export default React.memo(AuctionResultTable)