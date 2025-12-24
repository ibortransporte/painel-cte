import {
  Box,
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { errorHandler } from '@fluxu-labs/lib';
import { RHFTextInput, useForm, zodResolver } from '@fluxu-labs/lib';
import { useAuthContext } from 'src/hooks/useAuthContext';
import { AuthSchema } from './utils';
import { logoSvg } from 'src/assets';
import { SignInData } from 'src/contexts/AuthContext/types';

// ----------------------------------------------------------------------

export function Auth() {
  const theme = useTheme();
  const { signIn } = useAuthContext();
  const upSm = useMediaQuery((theme) => theme.breakpoints.up('sm'));

  // ----------------------------------------------------------------------

  const methods = useForm({
    resolver: zodResolver(AuthSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // ----------------------------------------------------------------------

  const onSubmit = async (data: SignInData) => {
    try {
      // try to sign in
      await signIn(data);

      // AuthGuard will handle redirection if auth succeeds
    } catch (error) {
      errorHandler({ error });
    }
  };

  // ----------------------------------------------------------------------

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent={{ xs: 'start', sm: 'center' }}
      sx={{
        width: '100vw',
        height: { xs: 'unset', sm: '100vh' },
        pt: { xs: 10, sm: 0 },
      }}
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ flex: { xs: 0, sm: 1 }, mb: 3 }}
      >
        <Box
          component="img"
          src={logoSvg}
          sx={{ maxWidth: { xs: 160, sm: 180, md: 210 } }}
        />
      </Stack>

      {upSm && (
        <Box sx={{ pt: 4, pb: 8, height: '100%' }}>
          <Box sx={{ height: '100%', borderLeft: theme.base.styles.border }} />
        </Box>
      )}

      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ flex: { xs: 0, sm: 1 }, padding: { xs: 2, sm: 3 } }}
      >
        <Stack sx={{ width: '100%', maxWidth: 340 }}>
          <Typography
            sx={{
              fontSize: 17,
              fontWeight: 500,
              textAlign: 'center',
            }}
          >
            <b>Olá</b>, bem-vindo!
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              color: theme.palette.text.secondary,
            }}
          >
            Informe suas credenciais abaixo
          </Typography>

          <Stack gap={1.5} sx={{ mt: 3 }}>
            <RHFTextInput
              control={control}
              name="email"
              autoFocus
              label="Email"
            />

            <RHFTextInput
              control={control}
              name="password"
              type="password"
              label="Senha"
            />
          </Stack>

          <Stack direction="row" gap={3} justifyContent="end" sx={{ mt: 3 }}>
            <Button
              fullWidth
              variant="contained"
              loading={isSubmitting}
              onClick={() => void handleSubmit(onSubmit)()}
            >
              Entrar
            </Button>
          </Stack>
        </Stack>
      </Stack>

      <Typography
        sx={{
          position: { xs: 'unset', sm: 'absolute' },
          width: '100%',
          textAlign: 'center',
          bottom: 0,
          p: 3,
          fontSize: 12,
          whiteSpace: 'pre-line',
        }}
      >
        Copyright © {new Date().getFullYear()} <b>IBOR CTe</b>
        {upSm ? ' - ' : '\n'}Todos os direitos reservados.
      </Typography>
    </Stack>
  );
}
