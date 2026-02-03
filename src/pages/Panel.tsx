import React, { useEffect, useState } from 'react';
import { Button, Layout, Table, message, Space, theme, Popconfirm, Tooltip, Tag } from 'antd';
import { ReloadOutlined, DeleteOutlined, StopOutlined, CheckCircleOutlined, ClearOutlined, EyeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import type { RootState, AppDispatch } from '../store/store';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import ActionHistoryModal from '../components/ActionHistoryModal';

const { Header, Content } = Layout;

interface UserDataType {
    id: string;
    email: string;
    fullName?: string;
    isBlocked: boolean;
    lastLoginTime?: string;
    registrationTime: string;
    position?: string;
    company?: string;
    isEmailConfirmed: boolean;
}

interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: string;
    filters?: Record<string, FilterValue | null>;
}

const Panel: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    useSelector((state: RootState) => state.auth);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [data, setData] = useState<UserDataType[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [modalUserId, setModalUserId] = useState<string | null>(null);

    const openActionHistory = (userId: string) => {
        setModalUserId(userId);
        setModalVisible(true);
    };

    const closeActionHistory = () => {
        setModalVisible(false);
        setModalUserId(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleApiError = (error: any, defaultMessage: string) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            handleLogout();
        } else {
            message.error(error.response?.data?.message || defaultMessage);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const { current = 1, pageSize = 10 } = tableParams.pagination || {};
            const sortField = tableParams.sortField;
            const sortOrder = tableParams.sortOrder === 'ascend' ? 'asc' : tableParams.sortOrder === 'descend' ? 'desc' : undefined;

            const response = await api.get('api/Admin/users', {
                params: {
                    page: current,
                    pageSize,
                    sortBy: sortField,
                    sortOrder,
                },
            });

            setData(response.data.items);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: response.data.total,
                },
            });
        } catch (error: any) {
            handleApiError(error, 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(tableParams)]); // Simple dependency check for object

    const handleTableChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<UserDataType> | SorterResult<UserDataType>[],
    ) => {
        const sortField = Array.isArray(sorter) ? undefined : sorter.field;
        const sortOrder = Array.isArray(sorter) ? undefined : sorter.order;

        setTableParams({
            pagination,
            filters,
            sortField: sortField as string,
            sortOrder: sortOrder as string,
        });

        // If sorting changed, reset to first page
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const handleBlock = async () => {
        if (selectedRowKeys.length === 0) return;
        try {
            await api.post('api/Admin/users/block', { userIds: selectedRowKeys });
            message.success('Users blocked successfully');
            fetchData();
            setSelectedRowKeys([]);
        } catch (error: any) {
            handleApiError(error, 'Failed to block users');
        }
    };

    const handleUnblock = async () => {
        if (selectedRowKeys.length === 0) return;
        try {
            await api.post('api/Admin/users/unblock', { userIds: selectedRowKeys });
            message.success('Users unblocked successfully');
            fetchData();
            setSelectedRowKeys([]);
        } catch (error: any) {
            handleApiError(error, 'Failed to unblock users');
        }
    };

    const handleDelete = async () => {
        if (selectedRowKeys.length === 0) return;
        try {
            await api.post('api/Admin/users/delete', { userIds: selectedRowKeys });
            message.success('Users deleted successfully');
            fetchData();
            setSelectedRowKeys([]);
        } catch (error: any) {
            handleApiError(error, 'Failed to delete users');
        }
    };

    const handleDeleteUnverified = async () => {
        try {
            await api.delete('api/Admin/users/unverified');
            message.success('Unverified users deleted successfully');
            fetchData();
        } catch (error: any) {
            handleApiError(error, 'Operation failed');
        }
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'fullName',
            sorter: true,
            render: (text: string, record: UserDataType) => (
                <div>
                    <div>{text || 'N/A'}</div>
                    {(record.position || record.company) && (
                        <div style={{ fontSize: '12px', color: '#888' }}>
                            {record.position} {record.position && record.company ? 'at' : ''} {record.company}
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true,
        },
        {
            title: 'Verification',
            dataIndex: 'isEmailConfirmed',
            sorter: true,
            // Requirement said "get it from db". We have isEmailConfirmed.
            render: (verified: boolean) => (
                <Tag color={verified ? 'success' : 'default'}>
                    {verified ? 'Verified' : 'Not Verified'}
                </Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'isBlocked',
            sorter: true,
            render: (blocked: boolean) => (
                <Tag color={blocked ? 'error' : 'success'}>
                    {blocked ? 'Blocked' : 'Active'}
                </Tag>
            ),
        },
        {
            title: 'Last Login',
            dataIndex: 'lastLoginTime',
            sorter: true,
            render: (date: string) => date ? new Date(date).toLocaleString() : 'Never',
        },
        {
            title: 'Registered',
            dataIndex: 'registrationTime',
            sorter: true,
            render: (date: string) => new Date(date).toLocaleString(),
        },
        {
            title: 'Action History',
            key: 'action',
            render: (_: any, record: UserDataType) => (
                <Button
                    icon={<EyeOutlined />}
                    onClick={() => openActionHistory(record.id)}
                />
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: '100%' }}>
            <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', background: colorBgContainer }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>User Chaos</div>
                <Space>
                    <Button type="primary" danger onClick={handleLogout}>
                        Logout
                    </Button>
                </Space>
            </Header>
            <Content style={{ padding: 24, background: colorBgContainer }}>
                <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <div style={{ marginBottom: 16 }}>
                        <Space wrap>
                            <Tooltip title="Deletes selected users">

                                <Button
                                    danger
                                    type="primary"
                                    icon={<DeleteOutlined />}
                                    disabled={!selectedRowKeys.length}
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                            </Tooltip>
                            <Tooltip title="Blocks selected users">
                                <Button
                                    icon={<StopOutlined />}
                                    disabled={!selectedRowKeys.length}
                                    onClick={handleBlock}
                                >
                                    Block
                                </Button>
                            </Tooltip>
                            <Tooltip title="Unblocks selected users">
                                <Button
                                    icon={<CheckCircleOutlined />}
                                    disabled={!selectedRowKeys.length}
                                    onClick={handleUnblock}
                                >
                                    Unblock
                                </Button>
                            </Tooltip>

                        </Space>

                        <span style={{ marginLeft: 8 }}>
                            {selectedRowKeys.length > 0 ? `Selected ${selectedRowKeys.length} users` : ''}
                        </span>
                    </div>
                    <Space>
                        <Tooltip title="Delete users who haven't verified email">
                            <Popconfirm title="Are you sure?" onConfirm={handleDeleteUnverified}>
                                <Button style={{ marginBottom: '16px' }} icon={<ClearOutlined />}>Delete Unverified</Button>
                            </Popconfirm>
                        </Tooltip>
                        <Tooltip title="Refresh">
                            <Button style={{ marginBottom: '16px' }} type="primary" icon={<ReloadOutlined />} onClick={fetchData} loading={loading} />
                        </Tooltip>
                    </Space>
                </Space>
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    rowKey={(record) => record.id}
                    dataSource={data}
                    pagination={tableParams.pagination}
                    loading={loading}
                    onChange={handleTableChange}
                />
                <ActionHistoryModal
                    visible={modalVisible}
                    onClose={closeActionHistory}
                    userId={modalUserId}
                />
            </Content>
        </Layout>
    );
};

export default Panel;
