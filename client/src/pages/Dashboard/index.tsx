import React, { useRef, useState } from "react";
import styles from './index.less';
import { useTranslation as t } from "@/hooks/useTranslation";
import { Button, DatePicker, TimeRangePickerProps, Form, Input, message, Card, Statistic, notification } from "antd";
import { AuctionResultTable, CustomizeModal, DemoChart, NavBar } from "@/components";
import { ProCard } from "@ant-design/pro-components";
import { connect, useAccount, useConnect } from "graz";
import { history } from "@umijs/max";
import { useAuth } from "@/hooks/useAuth";
import { TimePickerProps } from "antd/lib";
import { CustomizeModalHandles } from "@/components/CustomizeModal";
import Countdown from "antd/es/statistic/Countdown";
import { NotificationPlacement } from "antd/es/notification/interface";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_BIDS, GET_HISTORY, SENDBID_MUTATION } from "@/services/marketService";

const Dashboard = () => {
    const { RangePicker } = DatePicker as any;
    const [tab, setTab] = useState('tab1');
    const modalRef = useRef<CustomizeModalHandles>(null);
    const [bidData, setBidData] = useState<API.IHistoryItems[]>([]);
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [dateString, setDateString] = useState<string | [string, string]>(['', '']);
    const { authToken } = useAuth();
    const [form] = Form.useForm();
    const quantity = Form.useWatch('quantity', form);
    const price = Form.useWatch('price', form);
    const [deadline, setDeadLine] = useState(Date.now() + 30 * 1000);
    const [api, contextHolder] = notification.useNotification();
    const [currentBestBid, setCurrentBestBid] = useState(0)
    const [countdownPaused, setCountdownPaused] = useState(false);
    const { data: account, isConnected } = useAccount();
    const [sendBidResponse] = useMutation(SENDBID_MUTATION);
    const { error: errorAllBids, data: dataAllBids } = useQuery(GET_ALL_BIDS);
    const { error: errorHistory, data: dataHistory } = useQuery(GET_HISTORY);
    
    const handleChange = (e: any) => {
        e.preventDefault();
    }

    const onButtonClicked = () => {
        if (isConnected || authToken) {
            form.validateFields().then(() => {
                modalRef.current?.openModal();
            }).catch((error) => {
                console.error('Validation Failed:', error);
            });
        } else {
            history.push('/login');
        }
    };

    const getAllBids = async () => {
        if (dataAllBids && dataAllBids.getBids) {
            const { success, bids } = dataAllBids.getBids;
            if (success && bids.length > 0) {
                const acceptedItems = bids.filter((item: any) => item.status === "ACCEPTED");

                if (acceptedItems.length > 0) {
                    const highestPriceItem = acceptedItems.reduce((maxItem: any, currentItem: any) => {
                        const maxPrice = parseFloat(maxItem.price);
                        const currentPrice = parseFloat(currentItem.price);
                        return currentPrice > maxPrice ? currentItem : maxItem;
                    }, acceptedItems[0]);

                    setCurrentBestBid(highestPriceItem.price);
                }

                message.success("Successful")
                form.resetFields();
            }
        }
    }

    const handleOnBid = async () => {
        if (isConnected || authToken) {
            try {
                const response = await sendBidResponse({ variables: { price: parseInt(price), quantity: parseInt(quantity), startTime: dateString[0], endTime: dateString[1] } });
                const { data } = response;

                if (data && data.sendBid) {
                    const { success, errors } = data.sendBid;
                    if (success) {
                        await getAllBids();
                    }

                }
            } catch (err) {
                console.error('Error:', err)
            }
            // fetch("/api/marketplace/sendBid", {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${authToken}`
            //     },
            //     body: JSON.stringify({
            //         quantity: quantity,
            //         startTime: dateString[0],
            //         closeTime: dateString[1],
            //         price: price,
            //         walletAddress: account?.bech32Address || null
            //     })
            // })
            //     .then(response => {
            //         if (response.status === 401) {
            //             history.replace("/login")
            //         }
            //         return response.json()
            //     })
            //     .then(data => {
            //         if (data.code === "PARAM_MISSING") {
            //             message.error(data.message)
            //         }

            //         if (data.code === "SUCCESS") {
            //             const acceptedItems = data?.data.listOfItems.filter((item: any) => item.status === "ACCEPTED");

            //             if (acceptedItems.length > 0) {
            //                 const highestPriceItem = acceptedItems.reduce((maxItem: any, currentItem: any) => {
            //                     const maxPrice = parseFloat(maxItem.price);
            //                     const currentPrice = parseFloat(currentItem.price);
            //                     return currentPrice > maxPrice ? currentItem : maxItem;
            //                 }, acceptedItems[0]);

            //                 setCurrentBestBid(highestPriceItem.price);
            //             }

            //             message.success("Successful")
            //             form.resetFields();
            //         }
            //     })
            //     .catch(error => console.error('Error:', error));

        } else {
            history.push('/login')
        }
    }

    const onChange = (
        value: TimePickerProps['value'] | TimeRangePickerProps['value'],
        dateString: [string, string] | string,
    ) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        setDateString(dateString)
    };

    const openNotification = (placement: NotificationPlacement) => {
        api.info({
            message: `Time's up!`,
            description:
                'Here\'s the data for ur transaction.',
            placement,
        });

        setTab('tab2');    

        if (dataAllBids && dataAllBids.getBids) {
            const { success, bids } = dataAllBids.getBids;
            if (success && bids.length > 0) {
                setBidData(bids)
            }
        }

        if (dataHistory && dataHistory.getHistory) {
            const { success, bids } = dataHistory.getHistory;
            if (success && bids.length > 0) {
                setHistoryData(bids)
            }
        }
    };

    return (
        <div className={styles.wrapper}>
            {contextHolder}
            <ProCard tabs={{
                tabPosition: 'top',
                activeKey: tab,
                items: [
                    {
                        label: t('market'),
                        key: 'tab1',
                        children: <ProCard>
                            <ProCard colSpan="70%">
                                <DemoChart />
                            </ProCard>
                            <ProCard colSpan="30%" className={styles.inputWrapper}>
                                <Card style={{ marginBottom: '10px' }}>
                                    <Countdown title="Auction Time Left" value={countdownPaused ? 0 : deadline}
                                        format="HH:mm:ss:SSS"
                                        onFinish={() => openNotification('top')} />
                                </Card>

                                <Card style={{ marginBottom: '10px' }}>
                                    <Statistic
                                        title="Current Best Bid (cents/MWh)"
                                        value={currentBestBid}
                                        precision={2}
                                        valueStyle={{ color: '#3f8600' }}
                                        suffix="MWh"
                                    />
                                </Card>
                                <Form form={form} name="bid" autoComplete="off">
                                    <Form.Item name="quantity" rules={[{ required: true, message: 'Please input your quantity!' }]}
                                    >
                                        <Input
                                            placeholder="Quantity"
                                            name="quantity"
                                            type="number"
                                            onChange={handleChange}
                                        />

                                    </Form.Item>
                                    <Form.Item name="rangePicker" rules={[{ required: true, message: 'Please input your time!' }]}
                                    >
                                        <RangePicker
                                            showTime
                                            onChange={onChange}
                                        />

                                    </Form.Item>
                                    <Form.Item name='price' rules={[{ required: true, message: 'Please input your price!' }]}
                                    >
                                        <Input
                                            placeholder="Enter Price"
                                            name="price"
                                            type="number"
                                            onChange={handleChange}
                                        />
                                    </Form.Item>
                                </Form>
                                <CustomizeModal ref={modalRef} onButtonClicked={onButtonClicked} onSubmit={handleOnBid} title="Bid" quantity={quantity} startTime={dateString[0]} closeTime={dateString[1]} price={price} ></CustomizeModal>
                            </ProCard>
                        </ProCard>
                    },
                    {
                        label: t('result'),
                        key: 'tab2',
                        children: <AuctionResultTable bidsData={bidData} historyData={historyData} />,
                        forceRender: true
                    }
                ],
                onChange: (key) => {
                    setTab(key);
                    if (key === 'tab1') {
                        setCountdownPaused(false);
                        setDeadLine((rev) => rev)
                        setCurrentBestBid(0)
                    } else if (key === 'tab2') {
                        setCountdownPaused(true);
                    }
                },
            }}>
            </ProCard>
        </div>
    );
};

export default Dashboard;
