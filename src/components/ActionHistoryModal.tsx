import React, { useEffect, useState } from 'react';
import { Modal, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import api from '../utils/axios';

interface ActionHistoryModalProps {
    visible: boolean;
    onClose: () => void;
    userId: string | null;
}

interface ActionHistoryItem {
    action: string;
    timestamp: string;
    actionVictim?: string[];
}

const ActionHistoryModal: React.FC<ActionHistoryModalProps> = ({ visible, onClose, userId }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ActionHistoryItem[]>([]);

    useEffect(() => {
        if (visible && userId) {
            fetchHistory();
        } else {
            setData([]);
        }
    }, [visible, userId]);

    const fetchHistory = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const response = await api.get(`api/Admin/users/${userId}/history`);
            setData(response.data);
        } catch (error) {
            message.error('Failed to load history');
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnsType<ActionHistoryItem> = [
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (action: string) => {
                let color = 'blue';
                if (action === 'Login') color = 'green';
                if (action === 'Block') color = 'orange';
                if (action === 'Delete') color = 'red';
                return <Tag color={color}>{action}</Tag>;
            },
        },
        {
            title: 'Timestamp',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (text: string) => new Date(text).toLocaleString(),
        },
        {
            title: 'Details / Victims',
            dataIndex: 'actionVictim',
            key: 'actionVictim',
            render: (victims: string[]) => (
                <>
                    {victims && victims.length > 0 ? (
                        victims.map((v, i) => <div key={i}>{v}</div>)
                    ) : (
                        <span style={{ color: '#ccc' }}>-</span>
                    )}
                </>
            ),
        },
    ];

    return (
        <Modal
            title="Action History"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            <Table
                columns={columns}
                dataSource={data}
                rowKey={(record) => record.timestamp + record.action} 
                loading={loading}
                pagination={{ pageSize: 5 }}
            />
        </Modal>
    );
};

export default ActionHistoryModal;
