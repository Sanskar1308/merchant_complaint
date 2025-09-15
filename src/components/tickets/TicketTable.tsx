import React from 'react';
import { Table, Tag, Button, Space, Tooltip, Progress } from 'antd';
import { EyeOutlined, EditOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Ticket, TicketStatus, TicketPriority, TicketCategory } from '../../types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface TicketTableProps {
  tickets: Ticket[];
  loading?: boolean;
  onViewTicket: (ticket: Ticket) => void;
  onEditTicket: (ticket: Ticket) => void;
  selectedRowKeys: string[];
  onSelectChange: (selectedRowKeys: string[]) => void;
}

const TicketTable: React.FC<TicketTableProps> = ({
  tickets,
  loading,
  onViewTicket,
  onEditTicket,
  selectedRowKeys,
  onSelectChange,
}) => {
  const getStatusColor = (status: TicketStatus): string => {
    const colors = {
      OPEN: 'blue',
      IN_PROGRESS: 'orange',
      RESOLVED: 'green',
      CLOSED: 'default',
    };
    return colors[status];
  };

  const getPriorityColor = (priority: TicketPriority): string => {
    return priority === 'URGENT' ? 'red' : 'default';
  };

  const getCategoryLabel = (category: TicketCategory): string => {
    const labels = {
      DEVICE_ISSUE: 'Device Issue',
      PAYMENT_ISSUE: 'Payment Issue',
      AD_MANAGEMENT: 'Ad Management',
      BILLING: 'Billing',
      OTHER: 'Other',
    };
    return labels[category];
  };

  const getSLAProgress = (ticket: Ticket): { percent: number; status: 'success' | 'normal' | 'exception' } => {
    const now = dayjs();
    const deadline = dayjs(ticket.slaDeadline);
    const raised = dayjs(ticket.dateRaised);
    
    const totalTime = deadline.diff(raised);
    const elapsed = now.diff(raised);
    const percent = Math.min((elapsed / totalTime) * 100, 100);
    
    let status: 'success' | 'normal' | 'exception' = 'normal';
    if (percent >= 100) status = 'exception';
    else if (percent >= 80) status = 'normal';
    else status = 'success';
    
    return { percent, status };
  };

  const columns: ColumnsType<Ticket> = [
    {
      title: 'Ticket ID',
      dataIndex: 'ticketNumber',
      key: 'ticketNumber',
      width: 120,
      render: (text: string) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Merchant',
      dataIndex: 'merchantName',
      key: 'merchantName',
      width: 150,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 130,
      render: (category: TicketCategory) => (
        <Tag color="blue">{getCategoryLabel(category)}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: TicketStatus) => (
        <Tag color={getStatusColor(status)}>
          {status.replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: TicketPriority) => (
        <Tag color={getPriorityColor(priority)}>{priority}</Tag>
      ),
    },
    {
      title: 'Date Raised',
      dataIndex: 'dateRaised',
      key: 'dateRaised',
      width: 120,
      render: (date: string) => (
        <Tooltip title={dayjs(date).format('YYYY-MM-DD HH:mm:ss')}>
          {dayjs(date).fromNow()}
        </Tooltip>
      ),
    },
    {
      title: 'SLA Status',
      key: 'sla',
      width: 120,
      render: (_, ticket: Ticket) => {
        const { percent, status } = getSLAProgress(ticket);
        return (
          <Tooltip title={`Deadline: ${dayjs(ticket.slaDeadline).format('YYYY-MM-DD HH:mm')}`}>
            <Progress
              percent={percent}
              status={status}
              size="small"
              showInfo={false}
            />
          </Tooltip>
        );
      },
    },
    {
      title: 'Assigned Agent',
      dataIndex: 'assignedAgentName',
      key: 'assignedAgentName',
      width: 130,
      render: (name: string) => name || <Tag color="default">Unassigned</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, ticket: Ticket) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onViewTicket(ticket)}
            />
          </Tooltip>
          <Tooltip title="Edit Ticket">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEditTicket(ticket)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <Table
      columns={columns}
      dataSource={tickets}
      rowKey="id"
      loading={loading}
      rowSelection={rowSelection}
      scroll={{ x: 1200 }}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} tickets`,
      }}
    />
  );
};

export default TicketTable;