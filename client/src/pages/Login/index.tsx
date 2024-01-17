import {
    AlipayCircleOutlined,
    LockOutlined,
    MobileOutlined,
    TaobaoCircleOutlined,
    UserOutlined,
    WeiboCircleOutlined,
} from '@ant-design/icons';
import {
    LoginForm,
    ProConfigProvider,
    ProFormCaptcha,
    ProFormCheckbox,
    ProFormInstance,
    ProFormText,
    setAlpha,
} from '@ant-design/pro-components';
import { Button, Form, Space, Tabs, message, theme } from 'antd';
import type { CSSProperties } from 'react';
import React, { useState } from 'react';
import logo from '@/assets/logo.png';
import { history } from '@umijs/max';
import { WalletType, connect, useAccount } from 'graz';
import KeplrLogo from '@/assets/kepler.svg';
import { useAuth } from '@/hooks/useAuth';
import styles from './index.less';
import { useForm } from 'antd/es/form/Form';

type LoginType = 'phone' | 'account';

export default () => {
    const { token } = theme.useToken();
    const { login } = useAuth();
    const { data: account, isConnected } = useAccount();
    const { authToken } = useAuth();
    const [loginType, setLoginType] = useState<LoginType>('account');
    const [hasLoggedIn, setHasLoggedIn] = useState<boolean>(false);
    const formRef = useForm<ProFormInstance>();

    const iconStyles: CSSProperties = {
        marginInlineStart: '16px',
        color: setAlpha(token.colorTextBase, 0.2),
        width: '24px',
        height: '24px',
        verticalAlign: 'middle',
        cursor: 'pointer',
    };

    const handleSubmit = async (value: any) => {
        const { username, password } = value;
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
            });

            const data = await response.json();
            if (response.ok && data.authenticated) {
                login(data.token)
                history.push('/dashboard')
            } else {
                message.error("Login failed: " + (data.message || 'Unauthorized'));
            }
        } catch (error) {
            console.error("Login error:", error);
            message.error("An error occurred during login.");
        }
    }

    const handleRegister = async (value: any) => {
        const { username, password } = value;
        try {
            await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
            })
                .then((response) => { return response.json(); })
                .then((data: any) => {
                    if (data.code === 'USER_EXISTS') {
                        message.error("User has already exist")
                    }

                    if (data.code === 'USER_CREATED') {
                        if(formRef?.current) {
                            formRef?.current.resetFields();
                        }
                        setHasLoggedIn(true)
                        message.success("Successfully register")
                        
                    }
                }).catch(error => console.error('Error:', error));
        } catch (error) {
            console.error("Login error:", error);
            message.error("An error occurred during login.");
        }
    }

    const connectToKeplr = () => {
        connect({ chainId: ["cosmoshub-4"], walletType: WalletType.KEPLR }).then((data) => {
            fetch("/api/auth/authenticate", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    walletAddress: account?.address,
                })
            })
                .then((response: any) => { return response.json() })
                .then((data: any) => {
                    if (data.authenticated) {
                        login(data.sessionToken)
                        history.push('/dashboard')
                    }
                })
                .catch(error => console.error('Error:', error));


        });

    }

    const handleLogin = (event: any) => {
        event.preventDefault();
        setHasLoggedIn(true);
    }


    return (
        <ProConfigProvider hashed={false}>
            <div>
                <LoginForm
                    formRef={formRef}
                    logo={logo}
                    title="Electrify"
                    subTitle="Welcome to Electrify"
                    actions={
                        !authToken && !hasLoggedIn ? <>Or <a href="" onClick={handleLogin}>Login now!</a></> : <Space>
                            Other
                            <img src={KeplrLogo} style={iconStyles} alt="Keplr Logo" onClick={connectToKeplr} />
                        </Space>
                    }
                    onFinish={async (value) => {
                        if (!authToken && !hasLoggedIn) {
                            await handleRegister(value)
                        } else {
                            await handleSubmit(value)
                        }
                    }}
                    submitter={{
                        searchConfig: {
                            submitText: (!authToken && !hasLoggedIn) ? 'Register' : 'Login'
                        }
                    }}

                >
                    <Tabs
                        centered
                        activeKey={loginType}
                    >
                        <Tabs.TabPane key={'account'} tab={'Account Login'} />
                    </Tabs>
                    {loginType === 'account' && (
                        <>
                            <ProFormText
                                name="username"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined className={'prefixIcon'} />,
                                }}
                                placeholder={'Username'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter username!',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="password"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={'prefixIcon'} />,
                                    strengthText:
                                        'Password should contain numbers, letters and special characters, at least 8 characters long.',

                                    statusRender: (value) => {
                                        const getStatus = () => {
                                            if (value && value.length > 12) {
                                                return 'ok';
                                            }
                                            if (value && value.length > 6) {
                                                return 'pass';
                                            }
                                            return 'poor';
                                        };
                                        const status = getStatus();
                                        if (status === 'pass') {
                                            return (
                                                <div style={{ color: token.colorWarning }}>
                                                    Strength：medium
                                                </div>
                                            );
                                        }
                                        if (status === 'ok') {
                                            return (
                                                <div style={{ color: token.colorSuccess }}>
                                                    Strength：strong
                                                </div>
                                            );
                                        }
                                        return (
                                            <div style={{ color: token.colorError }}>Strength：weak</div>
                                        );
                                    },
                                }}
                                placeholder={'Password'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter password!',
                                    },
                                ]}
                            />
                        </>
                    )}
                </LoginForm>
            </div>
        </ProConfigProvider>
    );
};