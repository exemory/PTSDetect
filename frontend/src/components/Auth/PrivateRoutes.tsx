import MainLayout from '@/components/Layout/MainLayout/MainLayout';
import { routes } from '@/routes';
import { Outlet, Navigate } from 'react-router-dom';

export const PrivateRoutes = () => {
  const token = localStorage.getItem('token');

  return token ? (
    <MainLayout>
      <Outlet />
    </MainLayout>
  ) : (
    <Navigate to={routes.SIGN_IN} />
  );
};
