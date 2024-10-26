import MainLayout from '@/components/Layout/MainLayout/MainLayout';
import { GET_USER_AVATAR, GET_USER_INFO } from '@/graphql';
import { routes } from '@/routes';
import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { jwtDecode } from 'jwt-decode';

export const AdminRoutes = () => {
  const { data } = useQuery(GET_USER_INFO);
  const { data: avatarData } = useQuery(GET_USER_AVATAR);
  const token = localStorage.getItem('token');
  const { setUserInfo, setAvatarUrl } = useStore((state) => state);

  useEffect(() => {
    if (data) {
      setUserInfo(data.userInfo);
    }

    if (avatarData?.userAvatar.avatarUrl) {
      setAvatarUrl(avatarData.userAvatar.avatarUrl);
    }
  }, [data, avatarData]);

  const isAdmin = () => {
    if (!token) return false;

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Administrator';
    } catch (error) {
      console.error('Token decoding error:', error);
      return false;
    }
  };

  if (!token) {
    return <Navigate to={routes.SIGN_IN} />;
  }

  if (!isAdmin()) {
    return <Navigate to={routes.HOME} />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
