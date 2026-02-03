import React, { useEffect } from 'react';
import { Form, Input, Button, Checkbox, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../store/slices/authSlice';
import type { RootState, AppDispatch } from '../../store/store';
import FloatLabel from '../../components/FloatingInput';

const { Title } = Typography;

const Login: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [form] = Form.useForm();
    const [submittable, setSubmittable] = React.useState(false);

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

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
        if (error) {
            message.error(error);
            dispatch(clearError());
        }
    }, [isAuthenticated, error, navigate, dispatch]);

    const onFinish = (values: any) => {
        dispatch(login({
            credentials: { email: values.email, password: values.password },
            remember: values.remember
        }));
    };

    return (
        <>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>Login</Title>
            <Form
                form={form}
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                size="large"
            >
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please input your email' }, { message: 'Please enter a valid email!' }]}
                    style={{ paddingBottom: '8px' }}
                >
                    <FloatLabel label="Email">
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} />
                    </FloatLabel>
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                    style={{ paddingBottom: '8px' }}
                >
                    <FloatLabel label="Password">
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                        />
                    </FloatLabel>
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Link className="login-form-forgot" to="/forgot-password" style={{ float: 'right' }}>
                        Forgot password
                    </Link>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }} loading={isLoading} disabled={!submittable}>
                        Log in
                    </Button>
                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                        Don't have an account? <Link to="/register">Register</Link>
                    </div>
                </Form.Item>
            </Form>
        </>
    );
};

export default Login;
