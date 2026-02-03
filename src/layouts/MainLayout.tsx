import React from 'react';
import { Layout, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import logo from '../assets/logo.png';

const { Header, Content } = Layout;

const MainLayout: React.FC = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout>
            <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', alignItems: 'center', }}>

                <div style={{ marginLeft: 'auto', marginRight: '20px' }}>
                    <div style={{ padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={logo} alt="Chaos Logo" style={{ maxWidth: '100%', maxHeight: '40px' }} />
                    </div>
                </div>
            </Header>
            <Content
                style={{
                    margin: '24px 16px',
                    padding: 24,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                    height: "calc(100vh - 120px)"
                }}
            >
                <Outlet />
            </Content>
        </Layout>
    );
};

export default MainLayout;
