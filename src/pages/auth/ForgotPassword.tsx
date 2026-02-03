import React, { useState } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import { forgotPassword } from '../../store/slices/authSlice';

const { Title, Paragraph } = Typography;

const ForgotPassword: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [form] = Form.useForm();
    const [submittable, setSubmittable] = React.useState(false);

    const dispatch = useDispatch<AppDispatch>();

    const values = Form.useWatch([], form);

    React.useEffect(() => {
        form.validateFields({ validateOnly: true })
            .then(() => {
                setSubmittable(true);
            })
            .catch(() => {
                setSubmittable(false);
            });
    }, [form, values]);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            await dispatch(forgotPassword(values.email)).unwrap();
            setSent(true);
            message.success('Password reset link sent to your email.');
        } catch (error: any) {
            message.error(error || 'Failed to send reset link.');
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div style={{ textAlign: 'center' }}>
                <Title level={3}>Check your email</Title>
                <Paragraph>
                    We have sent a password reset link to your email address.
                </Paragraph>
                <Link to="/login">
                    <Button type="primary">Back to Login</Button>
                </Link>
            </div>
        );
    }

    return (
        <>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>Forgot Password</Title>
            <Paragraph style={{ textAlign: 'center', marginBottom: '30px' }}>
                Enter your email address and we'll send you a link to reset your password.
            </Paragraph>
            <Form
                form={form}
                name="forgot_password"
                onFinish={onFinish}
                size="large"
            >
                <Form.Item
                    name="email"
                    rules={[
                        { type: 'email', message: 'The input is not valid E-mail!' },
                        { required: true, message: 'Please input your E-mail!' },
                    ]}
                >
                    <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading} disabled={!submittable}>
                        Send Reset Link
                    </Button>
                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                        <Link to="/login">Back to Login</Link>
                    </div>
                </Form.Item>
            </Form>
        </>
    );
};

export default ForgotPassword;
