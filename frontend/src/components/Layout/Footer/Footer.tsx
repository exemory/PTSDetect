import { Box, Typography } from '@mui/joy';

export const Footer = () => {
  return (
    <Box
      component="footer"
      className="Footer"
      sx={[
        {
          paddingX: 4,
          paddingY: 1,
          gap: 2,
          bgcolor: 'background.surface',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gridColumn: '1 / -1',
          borderTop: '1px solid',
          borderColor: 'divider',
          top: 0,
          zIndex: 0,
        },
      ]}
    >
      <Typography level="body-sm"> &copy; 2024 All rights reserved</Typography>
    </Box>
  );
};
