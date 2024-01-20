import { routes } from '@/routes';
import { Outlet, Navigate } from 'react-router-dom';

export const PrivateRoutes = () => {
  const token = localStorage.getItem('token');

  return token ? <Outlet /> : <Navigate to={routes.SIGN_IN} />;
};
