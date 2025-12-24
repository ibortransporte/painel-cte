import { Navigate } from 'react-router-dom';
import { PermissionCheckData } from 'src/@types/permission';
import { useAuthContext } from 'src/hooks/useAuthContext';

// ----------------------------------------------------------------------

export function PermissionGuard({
  method,
  permissions,
  redirect,
  children,
}: {
  method: 'every' | 'some';
  permissions: PermissionCheckData[];
  redirect?: boolean;
  children: React.ReactNode;
}) {
  const { checkPermission } = useAuthContext();

  if (!checkPermission({ method, permissions })) {
    if (redirect) {
      return <Navigate to="/" replace />;
    }
    return null;
  }

  return <>{children}</>;
}
