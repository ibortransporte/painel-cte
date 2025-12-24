import { use } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';

// ----------------------------------------------------------------------

export function useAuthContext() {
  const context = use(AuthContext);

  if (!context) {
    throw new Error(`useAuthContext must be used within a AuthProvider`);
  }

  return context;
}
