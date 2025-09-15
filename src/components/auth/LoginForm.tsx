import React from 'react';
import { Form, Input, Button, Card, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';

const { Title, Text } = Typography;

interface LoginFormData {
  username: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { login, isLoggingIn } = useAuth();
  const [form] = Form.useForm();

  const onFinish = (values: LoginFormData) => {
    login(values);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ marginBottom: '8px', color: '#1890ff' }}>
              Merchant Complaint Admin
            </Title>
            <Text type="secondary">
              Sign in to your account
            </Text>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoggingIn}
                style={{ width: '100%', height: '45px' }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Demo Credentials: admin/admin123 or agent/agent123
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default LoginForm;