import MainLayout from '@/components/Layout/MainLayout/MainLayout';
import { GET_USER_AVATAR, GET_USER_INFO } from '@/graphql';
import { routes } from '@/routes';
import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';

export const PrivateRoutes = () => {
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

  return token ? (
    <MainLayout>
      <Outlet />
    </MainLayout>
  ) : (
    <Navigate to={routes.SIGN_IN} />
  );
};
