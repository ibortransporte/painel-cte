import { LoadingOverlay } from '@fluxu-labs/lib';
import { useAuthContext } from 'src/hooks/useAuthContext';
import { Auth } from 'src/pages/Auth';

// ----------------------------------------------------------------------

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isInitialized, isAuthenticated } = useAuthContext();

  if (!isInitialized) {
    return <LoadingOverlay />;
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  return <>{children}</>;
}
