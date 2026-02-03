import React from 'react';
import { Result, Button } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const EmailConfirmationPending: React.FC = () => {
    const location = useLocation();
    const message = location.state?.message || "We have sent a confirmation link to your email address. Please click the link to activate your account.";

    return (
        <Result
            icon={<MailOutlined />}
            title="Check your email"
            subTitle={message}
            extra={[
                <Link key="panel" to="/panel">
                    <Button type="primary">
                        Open Chaos
                    </Button>
                </Link>
            ]}
        />
    );
};

export default EmailConfirmationPending;
