import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Typography, Space } from 'antd';
import DashboardStats from '../components/dashboard/DashboardStats';
import { dashboardAPI } from '../services/api';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: dashboardAPI.getStats,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>Dashboard</Title>
      
      <DashboardStats 
        stats={stats || {
          openTickets: 0,
          inProgressTickets: 0,
          slaBreaches: 0,
          totalTickets: 0,
          avgResolutionTime: 0,
          customerSatisfaction: 0,
        }} 
        loading={isLoading} 
      />
    </Space>
  );
};

export default Dashboard;