import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { authAPI } from '../services/api';
import { message } from 'antd';

export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      authAPI.login(username, password),
    onSuccess: (data) => {
      login(data.user, data.token);
      message.success('Login successful');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Login failed');
    },
  });

  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authAPI.getCurrentUser,
    enabled: !!token && isAuthenticated,
    retry: false,
  });

  const handleLogout = () => {
    logout();
    message.success('Logged out successfully');
  };

  return {
    user: currentUser || user,
    token,
    isAuthenticated,
    isLoadingUser,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout: handleLogout,
  };
};