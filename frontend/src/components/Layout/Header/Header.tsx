import { routes } from '@/routes';
import { Avatar, Box, Dropdown, ListDivider, Menu, MenuButton, MenuItem, Typography } from '@mui/joy';
import { Fingerprint, LogOutIcon, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const navigate = useNavigate();

  const onLogOut = () => {
    localStorage.removeItem('token');
    navigate(routes.SIGN_IN);
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

      <Dropdown>
        <MenuButton variant="plain" size="sm" sx={{ maxWidth: '32px', maxHeight: '32px', borderRadius: '100%' }}>
          <Avatar
            src="https://i.pravatar.cc/40?img=2"
            srcSet="https://i.pravatar.cc/80?img=2"
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
          <MenuItem>
            <div className="flex items-center">
              <Avatar src="https://i.pravatar.cc/40?img=2" srcSet="https://i.pravatar.cc/80?img=2" />
              <Box sx={{ ml: 1.5 }}>
                <Typography level="title-sm" textColor="text.primary">
                  Rick Sanchez
                </Typography>
                <Typography level="body-xs" textColor="text.tertiary">
                  rick@email.com
                </Typography>
              </Box>
            </div>
          </MenuItem>

          <ListDivider />

          <MenuItem>
            <Settings size={16} /> Settings
          </MenuItem>

          <ListDivider />

          <MenuItem onClick={onLogOut}>
            <LogOutIcon size={16} /> Log out
          </MenuItem>
        </Menu>
      </Dropdown>
    </Box>
  );
};
