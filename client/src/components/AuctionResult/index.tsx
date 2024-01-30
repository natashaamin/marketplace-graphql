import { useAuth } from '@/hooks/useAuth';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import React, { useEffect, useState } from 'react';
import DemoHistoryChart from '../DemoHistoryChart';
import { formatDateTimeCustom } from '@/utils/util';
import { useAccount } from 'graz';
import { GET_ALL_BIDS, GET_BID_BY_ID, GET_HISTORY } from '@/services/marketService';
import { useMutation, useQuery } from '@apollo/client';
import dayjs from 'dayjs';

const AuctionResultTable = ({ bidsData, historyData }: any) => {
  const { authToken } = useAuth();
  const { data: account, isConnected } = useAccount();
  const [data, setData] = useState();
  const [chartData, setChartData] = useState<any>(null);
  const { error: errorAllBids, data: dataAllBids } = useQuery(GET_ALL_BIDS);
  const { error: errorHistory, data: dataHistory } = useQuery(GET_HISTORY);
  const [searchBidResponse] = useMutation(GET_BID_BY_ID);


  useEffect(() => {
    setData(bidsData);
    setChartData(historyData);
  }, [bidsData, historyData]);

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
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        const formattedDateTime = dayjs(entity.startTime).format('MMMM D, YYYY, HH:mm:ss A');
        return formattedDateTime
      },
    },
    {
      title: 'End Time',
      key: 'endTime',
      dataIndex: 'endTime',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        const formattedDateTime = dayjs(entity.endTime).format('MMMM D, YYYY, HH:mm:ss A');
        return formattedDateTime
      },
    },
    {
      title: 'DateRange',
      dataIndex: 'created_at',
      valueType: 'dateRange',
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
    }
  ];

  useEffect(() => {
    let isMounted = true;
    if (dataAllBids && dataAllBids.getBids && isMounted) {
      const { success, bids } = dataAllBids.getBids;
      if (success && bids.length > 0) {
        setData(bids);
      }
    }

    if (dataHistory && dataHistory.getHistory && isMounted) {
      const { success, bids } = dataHistory.getHistory;
      if (success && bids.length > 0) {
        const newBid = bids.map((bid: any) => {
          const date = dayjs(bid?.saleTime);
          return {
            id: bid.id,
            finalPrice: bid?.finalPrice,
            quantitySold: bid?.quantitySold,
            saleTime: date.format("MMM")
          }
        })
        setChartData(newBid);
      }
    }

    return () => {
      isMounted = false;
    }
  }, [dataAllBids, dataHistory]);

  return (
    <>
      {(chartData?.length !== 0) && <DemoHistoryChart historyData={chartData} />}
      <ProTable<API.IHistoryItems>
        columns={columns}
        dataSource={data}
        headerTitle="Result"
        rowKey="key"
        request={async (params, sort, filter) => {
          const { bidId, price, quantity, startTime, endTime } = params;
          const response = await searchBidResponse({ variables: { id: parseInt(bidId), price: parseInt(price), quantity: parseInt(quantity), startTime: new Date(startTime), endTime: new Date(endTime) }})
          const { data } = response;
          if (data && data.searchBid) {
              const { success, errors, bids } = data.searchBid;
              if (success) {
                setData(bids)
              }
          }

          return {
            success: true,
            data: []
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