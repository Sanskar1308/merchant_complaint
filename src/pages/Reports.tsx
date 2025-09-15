import React, { useState } from 'react';
import { Typography, Space, Card, Row, Col, DatePicker, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'days'),
    dayjs(),
  ]);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>Reports & Analytics</Title>
        <Space>
          <RangePicker
            value={dateRange}
            onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
          />
          <Button icon={<DownloadOutlined />}>
            Export All
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Ticket Volume by Category" style={{ height: '400px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '300px',
              color: '#999',
            }}>
              Chart will be implemented here
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="SLA Compliance" style={{ height: '400px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '300px',
              color: '#999',
            }}>
              Chart will be implemented here
            </div>
          </Card>
        </Col>
        
        <Col xs={24}>
          <Card title="Agent Performance Metrics" style={{ height: '400px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '300px',
              color: '#999',
            }}>
              Performance metrics table will be implemented here
            </div>
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default Reports;