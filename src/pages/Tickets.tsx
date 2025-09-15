import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Typography, 
  Space, 
  Card, 
  Button, 
  Row, 
  Col, 
  Select, 
  Input, 
  DatePicker,
  message,
} from 'antd';
import { SearchOutlined, FilterOutlined, ExportOutlined } from '@ant-design/icons';
import TicketTable from '../components/tickets/TicketTable';
import { ticketsAPI, reportsAPI } from '../services/api';
import { Ticket, TicketFilters } from '../types';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const Tickets: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [filters, setFilters] = useState<TicketFilters>({});
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data: ticketsData, isLoading } = useQuery({
    queryKey: ['tickets', page, pageSize, filters],
    queryFn: () => ticketsAPI.getTickets(page, pageSize, filters),
  });

  const handleViewTicket = (ticket: Ticket) => {
    // Navigate to ticket detail page
    console.log('View ticket:', ticket);
  };

  const handleEditTicket = (ticket: Ticket) => {
    // Open edit modal or navigate to edit page
    console.log('Edit ticket:', ticket);
  };

  const handleSelectChange = (selectedKeys: string[]) => {
    setSelectedRowKeys(selectedKeys);
  };

  const handleBulkStatusUpdate = async (status: string) => {
    try {
      await ticketsAPI.bulkUpdateStatus(selectedRowKeys, status);
      message.success(`Updated ${selectedRowKeys.length} tickets`);
      setSelectedRowKeys([]);
      // Refetch data
    } catch (error) {
      message.error('Failed to update tickets');
    }
  };

  const handleExport = async () => {
    try {
      const blob = await reportsAPI.exportTickets(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tickets-${dayjs().format('YYYY-MM-DD')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      message.success('Export completed');
    } catch (error) {
      message.error('Export failed');
    }
  };

  const handleFilterChange = (key: keyof TicketFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0); // Reset to first page when filtering
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>Ticket Management</Title>
        <Space>
          {selectedRowKeys.length > 0 && (
            <>
              <Button onClick={() => handleBulkStatusUpdate('IN_PROGRESS')}>
                Mark In Progress
              </Button>
              <Button onClick={() => handleBulkStatusUpdate('RESOLVED')}>
                Mark Resolved
              </Button>
            </>
          )}
          <Button 
            icon={<ExportOutlined />} 
            onClick={handleExport}
          >
            Export
          </Button>
        </Space>
      </div>

      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Search tickets..."
              prefix={<SearchOutlined />}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Status"
              style={{ width: '100%' }}
              allowClear
              mode="multiple"
              onChange={(value) => handleFilterChange('status', value)}
            >
              <Select.Option value="OPEN">Open</Select.Option>
              <Select.Option value="IN_PROGRESS">In Progress</Select.Option>
              <Select.Option value="RESOLVED">Resolved</Select.Option>
              <Select.Option value="CLOSED">Closed</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Category"
              style={{ width: '100%' }}
              allowClear
              mode="multiple"
              onChange={(value) => handleFilterChange('category', value)}
            >
              <Select.Option value="DEVICE_ISSUE">Device Issue</Select.Option>
              <Select.Option value="PAYMENT_ISSUE">Payment Issue</Select.Option>
              <Select.Option value="AD_MANAGEMENT">Ad Management</Select.Option>
              <Select.Option value="BILLING">Billing</Select.Option>
              <Select.Option value="OTHER">Other</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Priority"
              style={{ width: '100%' }}
              allowClear
              mode="multiple"
              onChange={(value) => handleFilterChange('priority', value)}
            >
              <Select.Option value="NORMAL">Normal</Select.Option>
              <Select.Option value="URGENT">Urgent</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RangePicker
              style={{ width: '100%' }}
              onChange={(dates) => {
                if (dates) {
                  handleFilterChange('dateFrom', dates[0]?.format('YYYY-MM-DD'));
                  handleFilterChange('dateTo', dates[1]?.format('YYYY-MM-DD'));
                } else {
                  handleFilterChange('dateFrom', undefined);
                  handleFilterChange('dateTo', undefined);
                }
              }}
            />
          </Col>
        </Row>

        <TicketTable
          tickets={ticketsData?.content || []}
          loading={isLoading}
          onViewTicket={handleViewTicket}
          onEditTicket={handleEditTicket}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={handleSelectChange}
        />
      </Card>
    </Space>
  );
};

export default Tickets;