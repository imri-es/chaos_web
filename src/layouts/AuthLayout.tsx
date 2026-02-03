import React from 'react';
import { Layout, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import logo from '../assets/logo.png';

const { Content } = Layout;

const AuthLayout: React.FC = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout style={{ minHeight: '98vh' }}>
            <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}>
                <div
                    style={{
                        padding: '40px',
                        background: colorBgContainer,
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        width: '100%',
                        maxWidth: '450px'
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <img src={logo} alt="Chaos App Logo" style={{ height: '100px', marginBottom: '10px' }} />
                    </div>
                    <Outlet />
                </div>
            </Content>
        </Layout>
    );
};

export default AuthLayout;
