import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import styles from './index.less';
import { useTranslation as t } from "@/hooks/useTranslation";
import { Button, TimePicker, TimeRangePickerProps, Form, Input, message, Card, Statistic, notification } from "antd";
import { AuctionResultTable, CustomizeModal, DemoChart, NavBar } from "@/components";
import { ProCard, ProColumns, ProTable } from "@ant-design/pro-components";
import { connect, useAccount, useConnect } from "graz";
import { history } from "@umijs/max";
import { useAuth } from "@/hooks/useAuth";
import { TimePickerProps } from "antd/lib";
import Countdown from "antd/es/statistic/Countdown";
import { ArrowUpOutlined } from "@ant-design/icons";
import { CustomizeModalHandles } from "@/components/CustomizeModal";
import { NotificationPlacement } from "antd/es/notification/interface";

const Dashboard = () => {
    const { RangePicker } = TimePicker as any;
    const [tab, setTab] = useState('tab1');
    const modalRef = useRef<CustomizeModalHandles>(null);
    const [bidData, setBidData] = useState<API.IHistoryItems[]>([]);
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [dateString, setDateString] = useState<string | [string, string]>(['', '']);
    const { isConnected } = useAccount();
    const { authToken } = useAuth();
    const [form] = Form.useForm();
    const quantity = Form.useWatch('quantity', form);
    const price = Form.useWatch('price', form);
    const deadline = Date.now() + 15 * 60 * 1000;
    const [api, contextHolder] = notification.useNotification();

    console.log(process.env.NODE_ENV,">>> env")

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

    const handleOnBid = () => {
        if (isConnected || authToken) {
            fetch("/api/marketplace/sendBid", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    quantity: quantity,
                    startTime: dateString[0],
                    closeTime: dateString[1],
                    price: price
                })
            })
                .then(response => {
                    if (response.status === 401) {
                        history.replace("/login")
                    }
                    return response.json()
                })
                .then(data => {
                    if (data.code === "PARAM_MISSING") {
                        message.error(data.message)
                    }

                    if (data.code === "SUCCESS") {
                        message.success("Successful")
                        form.resetFields();
                        setTab('tab2');
                        const callHistory =
                            fetch("/apimarketplace/getHistory", {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${authToken}`
                                },
                            })
                                .then(response => {
                                    if (response.status === 401) {
                                        history.replace("/login")
                                    }
                                    return response.json()
                                })
                                .catch(error => console.error('Error:', error));


                        const callTransactions =
                            fetch("/apimarketplace/getTotalTransactions", {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${authToken}`
                                },
                            })
                                .then(response => {
                                    if (response.status === 401) {
                                        history.replace("/login")
                                    }
                                    return response.json()
                                })
                                .catch(error => console.error('Error:', error));

                        Promise.all([callHistory, callTransactions])
                            .then(([data1, data2]) => {
                                const newData = data1.data.map((x: any, index: number) => {
                                    return {
                                        key: index,
                                        ...x
                                    }
                                })
                                setBidData(newData)
                                setHistoryData(data2)
                            })
                            .catch(error => {
                                console.error('An error occurred:', error);
                            });

                    }
                })
                .catch(error => console.error('Error:', error));

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
            message: `Notification ${placement}`,
            description:
                'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
            placement,
        });
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
                                    <Countdown title="Auction Time Left" value={deadline} format="HH:mm:ss:SSS"
                                        onFinish={() => openNotification('top')} />
                                </Card>
                                <Card style={{ marginBottom: '10px' }}>
                                    <Statistic
                                        title="Current Best Bid (cents/MWh)"
                                        value={11.28}
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
                                            showTime={{ format: 'HH:mm' }}
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
                },
            }}>
            </ProCard>
        </div>
    );
};

export default Dashboard;
