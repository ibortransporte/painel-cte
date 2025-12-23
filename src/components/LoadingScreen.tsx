import { Box, useTheme } from '@mui/material';
import { logoDarkSvg, logoSvg } from 'src/assets';

// ----------------------------------------------------------------------

export function LoadingScreen() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        right: 0,
        bottom: 0,
        zIndex: 99999,
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'fixed',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Box
        component="img"
        src={theme.palette.mode === 'dark' ? logoDarkSvg : logoSvg}
        sx={{ maxHeight: 32, mb: 6 }}
      />

      <LoadingDotsAnimation />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function LoadingDotsAnimation({ paper }: { paper?: true }) {
  const theme = useTheme();

  const primaryColor = theme.palette.primary.main;
  const fadedColor = paper
    ? theme.palette.background.paper
    : theme.palette.background.default;

  const boxShadow = {
    main: {
      before: `9984px 0 0 0 ${primaryColor}`,
      center: `9999px 0 0 0 ${primaryColor}`,
      after: `10014px 0 0 0 ${primaryColor}`,
    },
    faded: {
      before: {
        start: `9984px -15px 0 0 ${fadedColor}`,
        end: `9984px 15px 0 0 ${fadedColor}`,
      },
      center: {
        start: `9999px -15px 0 0 ${fadedColor}`,
        end: `9999px 15px 0 0 ${fadedColor}`,
      },
      after: {
        start: `10014px -15px 0 0 ${fadedColor}`,
        end: `10014px 15px 0 0 ${fadedColor}`,
      },
    },
  };

  return (
    <Box
      sx={{
        position: 'relative',
        left: '-9999px',
        width: '10px',
        height: '10px',
        borderRadius: '5px',
        backgroundColor: primaryColor,
        color: primaryColor,
        boxShadow: boxShadow.main.center,
        animation: 'dot-falling 1s infinite linear',
        animationDelay: '0.1s',
        '&::before, &::after': {
          content: '""',
          display: 'inline-block',
          position: 'absolute',
          top: 0,
        },
        '&::before': {
          width: '10px',
          height: '10px',
          borderRadius: '5px',
          backgroundColor: primaryColor,
          color: primaryColor,
          animation: 'dot-falling-before 1s infinite linear',
          animationDelay: '0s',
        },
        '&::after': {
          width: '10px',
          height: '10px',
          borderRadius: '5px',
          backgroundColor: primaryColor,
          color: primaryColor,
          animation: 'dot-falling-after 1s infinite linear',
          animationDelay: '0.2s',
        },
        '@keyframes dot-falling-before': {
          '0%': {
            boxShadow: boxShadow.faded.before.start,
          },
          '25%': {
            boxShadow: boxShadow.main.before,
          },
          '75%': {
            boxShadow: boxShadow.main.before,
          },
          '100%': {
            boxShadow: boxShadow.faded.before.end,
          },
        },
        '@keyframes dot-falling': {
          '0%': {
            boxShadow: boxShadow.faded.center.start,
          },
          '25%': {
            boxShadow: boxShadow.main.center,
          },
          '75%': {
            boxShadow: boxShadow.main.center,
          },
          '100%': {
            boxShadow: boxShadow.faded.center.end,
          },
        },
        '@keyframes dot-falling-after': {
          '0%': {
            boxShadow: boxShadow.faded.after.start,
          },
          '25%': {
            boxShadow: boxShadow.main.after,
          },
          '75%': {
            boxShadow: boxShadow.main.after,
          },
          '100%': {
            boxShadow: boxShadow.faded.after.end,
          },
        },
      }}
    />
  );
}
