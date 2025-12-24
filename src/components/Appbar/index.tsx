import { Box, Button, Stack, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logoDarkSvg, logoSvg } from 'src/assets';
import { ProfileButton } from './ProfileButton';

// ----------------------------------------------------------------------

export const APPBAR_HEIGHT = 50; // px

// ----------------------------------------------------------------------

export function Appbar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const pathname = window.location.pathname;

  return (
    <>
      <Box
        className="Appbar-block"
        sx={{ height: APPBAR_HEIGHT, flexShrink: 0 }}
      />

      <Stack
        className="Appbar-root"
        sx={{
          position: 'fixed',
          width: '100%',
          zIndex: 1000,
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        <Stack
          direction="row"
          alignItems={'center'}
          sx={{
            gap: 2,
            px: 2,
            height: APPBAR_HEIGHT,
            borderBottom: theme.base.styles.border,
          }}
        >
          <Box
            component="img"
            src={theme.palette.mode === 'dark' ? logoDarkSvg : logoSvg}
            sx={{
              maxHeight: 28,
              position: 'absolute',
              left: 0,
              px: 2,
            }}
          />

          <Box sx={{ flex: 1 }} />

          <Stack direction={'row'}>
            <AppbarMenuItem
              active={pathname === ''}
              label={'NFs pendente de CTe'}
              onClick={() => void navigate('')}
            />
          </Stack>

          <Box sx={{ flex: 1 }} />

          <ProfileButton />
        </Stack>
      </Stack>
    </>
  );
}

// ----------------------------------------------------------------------

export function AppbarMenuItem({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  const theme = useTheme();

  return (
    <Button
      size="small"
      color="inherit"
      onClick={onClick}
      sx={{
        px: 1.5,
        fontSize: 13,
        fontWeight: 500,
        color: active
          ? theme.palette.text.primary
          : theme.palette.text.secondary,
      }}
    >
      {label}
    </Button>
  );
}
