import React, { useState } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import { resetPassword } from '../../store/slices/authSlice';

const { Title } = Typography;

const ResetPassword: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email'); // Depending on backend implementation
    const [form] = Form.useForm();
    const [submittable, setSubmittable] = React.useState(false);

    const dispatch = useDispatch<AppDispatch>();

    // Watch all values
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
            await dispatch(resetPassword({
                token,
                email,
                newPassword: values.password
            })).unwrap();
            message.success('Password reset successfully.');
            navigate('/login');
        } catch (error: any) {
            message.error(error || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>Reset Password</Title>
            <Form
                form={form}
                name="reset_password"
                onFinish={onFinish}
                size="large"
                layout="vertical"
            >
                <Form.Item
                    name="password"
                    label="New Password"
                    rules={[
                        { required: true, message: 'Please input your new password!' },
                    ]}
                    hasFeedback
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="New Password" />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirm New Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        { required: true, message: 'Please confirm your new password!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Confirm New Password" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading} disabled={!submittable}>
                        Reset Password
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default ResetPassword;
