import { AuthLayout } from '@/pages/Auth/components';
import { routes } from '@/routes';
import { Outlet, Navigate } from 'react-router-dom';

export const AuthRoutes = () => {
  const token = localStorage.getItem('token');

  return !token ? (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  ) : (
    <Navigate to={routes.HOME} />
  );
};
