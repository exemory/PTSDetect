import { routes } from '@/routes';
import { Avatar, Box, Dropdown, ListDivider, Menu, MenuButton, MenuItem, Typography } from '@mui/joy';
import { Fingerprint, LogOutIcon, ClipboardCheck, BookLock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import avatarImage from '@/assets/images/avatar.jpg';
import { useStore } from '@/store/useStore';
import { LanguageSelect } from '@/components/LanguageSelect';
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';

export const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, avatarUrl } = useStore((state) => state);

  const onLogOut = () => {
    localStorage.removeItem('token');
    navigate(routes.SIGN_IN);
  };

  const isAdmin = () => {
    const token = localStorage.getItem('token');

    if (!token) return false;

    const decodedToken: any = jwtDecode(token);

    return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Administrator';
  };

  return (
    <Box
      component="header"
      className="Header"
      sx={[
        {
          paddingX: 4,
          paddingY: 2,
          gap: 2,
          bgcolor: 'background.surface',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gridColumn: '1 / -1',
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          zIndex: 1,
        },
      ]}
    >
      <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => navigate('/')}>
        <Fingerprint />
        <Typography level="h4">PTSDetect</Typography>
      </div>

      <div className="flex gap-6">
        <LanguageSelect />

        <Dropdown>
          <MenuButton variant="plain" size="sm" sx={{ maxWidth: '32px', maxHeight: '32px', borderRadius: '100%' }}>
            <Avatar
              src={avatarUrl || avatarImage}
              srcSet={avatarUrl || avatarImage}
              sx={{ maxWidth: '32px', maxHeight: '32px' }}
            />
          </MenuButton>
          <Menu
            placement="bottom-end"
            size="sm"
            sx={{
              zIndex: 2,
              p: 1,
              gap: 1,
              '--ListItem-radius': '5px',
            }}
          >
            <MenuItem onClick={() => navigate(routes.PROFILE)}>
              <div className="flex items-center">
                <Avatar src={avatarUrl || avatarImage} srcSet={avatarUrl || avatarImage} />
                <Box sx={{ ml: 1.5 }}>
                  <Typography level="title-sm" textColor="text.primary">
                    {user.personalInfo?.firstName} {user.personalInfo?.lastName}
                  </Typography>
                  <Typography level="body-xs" textColor="text.tertiary">
                    {user.email}
                  </Typography>
                </Box>
              </div>
            </MenuItem>

            <ListDivider />

            <MenuItem onClick={() => navigate(routes.RESULTS)}>
              <ClipboardCheck size={16} /> {t('header.completed-evaluations')}
            </MenuItem>

            <ListDivider />

            {isAdmin() && (
              <>
                <MenuItem onClick={() => navigate(routes.ADMIN_RESULTS)}>
                  <BookLock size={16} /> {t('admin.title')}
                </MenuItem>
                <ListDivider />
              </>
            )}

            <MenuItem onClick={onLogOut}>
              <LogOutIcon size={16} /> {t('header.log-out')}
            </MenuItem>
          </Menu>
        </Dropdown>
      </div>
    </Box>
  );
};
