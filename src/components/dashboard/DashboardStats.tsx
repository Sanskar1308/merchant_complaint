import React from 'react';
import { Row, Col, Card, Statistic, Progress } from 'antd';
import {
  CustomerServiceOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { DashboardStats as StatsType } from '../../types';

interface DashboardStatsProps {
  stats: StatsType;
  loading?: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, loading }) => {
  const statCards = [
    {
      title: 'Open Tickets',
      value: stats.openTickets,
      icon: <CustomerServiceOutlined style={{ color: '#1890ff' }} />,
      color: '#1890ff',
    },
    {
      title: 'In Progress',
      value: stats.inProgressTickets,
      icon: <ClockCircleOutlined style={{ color: '#faad14' }} />,
      color: '#faad14',
    },
    {
      title: 'SLA Breaches',
      value: stats.slaBreaches,
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      color: '#ff4d4f',
    },
    {
      title: 'Total Tickets',
      value: stats.totalTickets,
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      color: '#52c41a',
    },
  ];

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {statCards.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card loading={loading}>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Average Resolution Time" loading={loading}>
            <Statistic
              value={stats.avgResolutionTime}
              suffix="hours"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Progress
              percent={Math.min((24 / stats.avgResolutionTime) * 100, 100)}
              strokeColor="#1890ff"
              showInfo={false}
              style={{ marginTop: '16px' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="Customer Satisfaction" loading={loading}>
            <Statistic
              value={stats.customerSatisfaction}
              suffix="%"
              prefix={<SmileOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Progress
              percent={stats.customerSatisfaction}
              strokeColor="#52c41a"
              showInfo={false}
              style={{ marginTop: '16px' }}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashboardStats;