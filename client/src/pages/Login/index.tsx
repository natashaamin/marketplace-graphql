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
import { gql, useMutation } from '@apollo/client';
import { LOGIN_MUTATION, REGISTER_MUTATION } from '@/services/authService';

type LoginType = 'phone' | 'account';

export default () => {
    const { token } = theme.useToken();
    const { login } = useAuth();
    const { data: account, isConnected } = useAccount();
    const { authToken } = useAuth();
    const [loginType, setLoginType] = useState<LoginType>('account');
    const [hasLoggedIn, setHasLoggedIn] = useState<boolean>(false);
    const formRef = useForm<ProFormInstance>();
    const [registerResponse] = useMutation(REGISTER_MUTATION);
    const [loginResponse] = useMutation(LOGIN_MUTATION);

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
            const response = await loginResponse({ variables: { username, password }});
            const { data } = response;

            if(data && data.login) {
                const { success, errors, token } = data.login;
                if (success) {
                    login(token)
                    history.push('/dashboard')
                } else if (errors && errors.length > 0) {
                    errors.forEach((error: any) => {
                        message.error(error.message);
                    });               
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            message.error("An error occurred during login.");
        }
    }

    const handleRegister = async (value: any) => {
        const { username, password } = value;
        try {
            // Perform the mutation and wait for the response
            const response = await registerResponse({ variables: { username, password } });
    
            // Extract data from the mutation response
            const { data } = response;
            if (data && data.register) {
                const { success, errors } = data.register;
    
                if (success) {
                    // Handle successful registration
                    formRef?.current?.resetFields();
                    setHasLoggedIn(true);
                    message.success("Successfully registered");
                } else if (errors && errors.length > 0) {
                    // Display errors from the server
                    errors.forEach((error: any) => {
                        message.error(error.message);
                    });
                }
            }
        } catch (error) {
            // Handle network or server errors
            console.error("Register error:", error);
            message.error("An error occurred during registration.");
        }
    };
    
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