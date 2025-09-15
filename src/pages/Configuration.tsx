import React from 'react';
import { Typography, Space, Card, Tabs } from 'antd';
import { SettingOutlined, TagsOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Configuration: React.FC = () => {
  const tabItems = [
    {
      key: 'categories',
      label: 'Categories',
      icon: <TagsOutlined />,
      children: (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '300px',
          color: '#999',
        }}>
          Category management will be implemented here
        </div>
      ),
    },
    {
      key: 'sla',
      label: 'SLA Settings',
      icon: <ClockCircleOutlined />,
      children: (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '300px',
          color: '#999',
        }}>
          SLA configuration will be implemented here
        </div>
      ),
    },
    {
      key: 'merchants',
      label: 'Merchant Profiles',
      icon: <UserOutlined />,
      children: (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '300px',
          color: '#999',
        }}>
          Merchant management will be implemented here
        </div>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>
        <SettingOutlined /> Configuration
      </Title>
      
      <Card>
        <Tabs
          items={tabItems}
          size="large"
          style={{ minHeight: '400px' }}
        />
      </Card>
    </Space>
  );
};

export default Configuration;