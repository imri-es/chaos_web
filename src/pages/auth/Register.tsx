import React, { useEffect } from 'react';
import { Form, Input, Button, Checkbox, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, BankOutlined, IdcardOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../store/slices/authSlice';
import type { RootState, AppDispatch } from '../../store/store';
import FloatLabel from '../../components/FloatingInput';

const { Title } = Typography;

const Register: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);
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
        if (error) {
            message.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const onFinish = async (values: any) => {
        const { remember, confirm, ...userData } = values;
        const resultAction = await dispatch(register({ userData, remember }));

        if (register.fulfilled.match(resultAction)) {
            navigate('/email-pending', {
                state: {
                    message: resultAction.payload.message
                }
            });
        }
    };

    return (
        <>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>Register</Title>
            <Form
                form={form}
                name="register"
                onFinish={onFinish}
                scrollToFirstError
                size="large"
                layout="vertical"
            >
                <Form.Item
                    name="fullName"
                    rules={[{ required: true, message: 'Please input your name!', whitespace: true }]}
                    style={{ paddingBottom: '8px' }}
                >
                    <FloatLabel label="Name">
                        <Input prefix={<UserOutlined />} />
                    </FloatLabel>

                </Form.Item>

                <Form.Item
                    name="email"
                    rules={[
                        { type: 'email', message: 'The input is not valid E-mail!' },
                        { required: true, message: 'Please input your E-mail!' },
                    ]}
                    style={{ paddingBottom: '8px' }}
                >
                    <FloatLabel label="Email">
                        <Input prefix={<MailOutlined />} />
                    </FloatLabel>
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: 'Please input your password!' },
                    ]}
                    hasFeedback
                    style={{ paddingBottom: '8px' }}
                >
                    <FloatLabel label="Password">
                        <Input.Password prefix={<LockOutlined />} />
                    </FloatLabel>
                </Form.Item>

                <Form.Item
                    name="confirm"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        { required: true, message: 'Please confirm your password!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                        }),
                    ]}
                    style={{ paddingBottom: '8px' }}
                >
                    <FloatLabel label="Confirm Password">
                        <Input.Password prefix={<LockOutlined />} />
                    </FloatLabel>
                </Form.Item>

                <Form.Item
                    name="workingPosition"
                    rules={[{ required: true, message: 'Please input your working position!' }]}
                    style={{ paddingBottom: '8px' }}
                >
                    <FloatLabel label="Working Position">
                        <Input prefix={<IdcardOutlined />} />
                    </FloatLabel>
                </Form.Item>

                <Form.Item
                    name="company"
                    rules={[{ required: true, message: 'Please input your company!' }]}
                    style={{ paddingBottom: '8px' }}
                >
                    <FloatLabel label="Company">
                        <Input prefix={<BankOutlined />} />
                    </FloatLabel>
                </Form.Item>

                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={isLoading} disabled={!submittable}>
                        Register
                    </Button>
                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                        Already have an account? <Link to="/login">Login</Link>
                    </div>
                </Form.Item>
            </Form>
        </>
    );
};

export default Register;
