import { Avatar, LibFAIcon } from '@fluxu-labs/lib';
import {
  useColorScheme,
  Popover,
  Stack,
  Typography,
  Box,
  Button,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { useAuthContext } from 'src/hooks/useAuthContext';

// ----------------------------------------------------------------------

export function ProfileButton() {
  const theme = useTheme();
  const { signOut, user } = useAuthContext();
  const { mode, setMode, systemMode } = useColorScheme();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const currentMode = (mode === 'system' ? systemMode : mode) || 'light';

  return (
    <>
      <Avatar url={null} onClick={(e) => setAnchorEl(e.currentTarget)} />

      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: -4, horizontal: 0 }}
      >
        <Stack sx={{ width: 220 }}>
          <Stack sx={{ px: 1.5, py: 1 }}>
            <Typography noWrap sx={{ fontSize: 13, fontWeight: 500 }}>
              {user?.name}
            </Typography>

            <Typography
              noWrap
              sx={{ fontSize: 12, color: theme.palette.text.secondary }}
            >
              {user?.email}
            </Typography>
          </Stack>

          <Box sx={{ borderBottom: theme.base.styles.borderFaded }} />

          <Stack sx={{ m: 0.5 }}>
            <ProfileItem
              label={currentMode === 'dark' ? 'Modo claro' : 'Modo escuro'}
              icon={
                <LibFAIcon
                  icon={currentMode === 'dark' ? 'lightMode' : 'darkMode'}
                  fontSize={12}
                />
              }
              onClick={() => {
                const _mode = currentMode === 'dark' ? 'light' : 'dark';
                setMode(_mode);
                setAnchorEl(null);
              }}
            />

            <ProfileItem
              label="Sair"
              icon={<LibFAIcon icon="signOut" fontSize={12} />}
              onClick={() => void signOut()}
            />
          </Stack>
        </Stack>
      </Popover>
    </>
  );
}

function ProfileItem({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: VoidFunction;
}) {
  return (
    <Button
      size="small"
      color="inherit"
      onClick={onClick}
      endIcon={icon}
      sx={{
        px: 1,
        fontSize: 13,
        fontWeight: 500,
        justifyContent: 'start',
      }}
    >
      {label}
    </Button>
  );
}
