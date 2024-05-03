import MainLayout from '@/components/Layout/MainLayout/MainLayout';
import { GET_USER_INFO } from '@/graphql';
import { routes } from '@/routes';
import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';

export const PrivateRoutes = () => {
  const { data } = useQuery(GET_USER_INFO);
  const token = localStorage.getItem('token');
  const { setUserInfo } = useStore((state) => state);

  useEffect(() => {
    if (data) {
      setUserInfo(data.userInfo);
    }
  }, [data]);

  return token ? (
    <MainLayout>
      <Outlet />
    </MainLayout>
  ) : (
    <Navigate to={routes.SIGN_IN} />
  );
};
