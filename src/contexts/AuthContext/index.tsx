import { createContext, useEffect, useReducer } from 'react';
import {
  AuthContext_Storage,
  AuthContextProps,
  AuthContextState,
  SessionData,
  SignInData,
} from './types';
import { services } from './utils';
import { LoadingOverlay, toast } from '@fluxu-labs/lib';
import { UserData } from 'src/@types/user';
import { deserializeToken } from 'src/utils/auth';
import { useLocalStorage } from '@fluxu-labs/lib';
import {
  PermissionCheckData,
  PermissionCheckParams,
  PermissionData,
} from 'src/@types/permission';
import { StorageKey } from 'src/utils/storage';
import { apolloClient } from 'src/utils/apollo';

// ----------------------------------------------------------------------

function Reducer(
  state: AuthContextState,
  action:
    | {
        type: 'INIT';
        payload: { user: UserData | null; permissions: PermissionData[] };
      }
    | { type: 'RESET' },
): AuthContextState {
  switch (action.type) {
    case 'INIT': {
      const payload = action.payload;
      return {
        isInitialized: true,
        isAuthenticated: !!payload.user,
        user: payload.user,
        permissions: payload.user ? payload.permissions : [],
      };
    }

    case 'RESET': {
      return {
        isInitialized: true,
        isAuthenticated: false,
        user: null,
        permissions: [],
      };
    }

    default:
      return state;
  }
}

// ----------------------------------------------------------------------

let refreshTokenTimeout: NodeJS.Timeout | number | undefined;

const initialState: AuthContextState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
  permissions: [],
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(Reducer, initialState);

  const [storedAuthContext, setStoredAuthContext] =
    useLocalStorage<AuthContext_Storage | null>(
      StorageKey['auth-context'],
      null,
    );

  // ----------------------------------------------------------------------

  useEffect(() => {
    if (storedAuthContext) {
      validateSession(storedAuthContext).catch((error) => {
        console.error('[Fluxu] VALIDATE-SESSION-ERROR: ', error);
        toast.error('Sua sessão expirou. Por favor, faça login novamente.');
        void reset();
      });
    } else {
      void reset();
    }
    return () => {
      clearInterval(refreshTokenTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //

  const reset = async (): Promise<void> => {
    clearTimeout(refreshTokenTimeout);
    dispatch({ type: 'RESET' });
    setStoredAuthContext(null);
    void apolloClient.resetStore();
  };

  // ----------------------------------------------------------------------

  const refreshTokenLoop = (sessionData: SessionData) => {
    // renew token every minute
    refreshTokenTimeout = setTimeout(() => {
      void services.refreshToken(sessionData.refresh_token).then((newToken) => {
        refreshTokenLoop({
          token: newToken,
          refresh_token: sessionData.refresh_token,
        });
      });
    }, 1000 * 60);
  };

  const validateSession = async (sessionData: SessionData): Promise<void> => {
    if (!sessionData.token || !sessionData.refresh_token) return reset();

    const deserialized = deserializeToken(sessionData.token);
    if (!deserialized) return reset();

    const newToken = await services.refreshToken(sessionData.refresh_token);

    // get user data
    const { user, hasAccess, permissions } = await services.getUserData({
      uuid: deserialized.claims.userUuid,
      token: newToken,
    });

    if (!hasAccess) {
      toast.error('Você não tem acesso a essa aplicação.');
      return reset();
    }

    dispatch({ type: 'INIT', payload: { user, permissions } });
    setStoredAuthContext({
      token: newToken,
      refresh_token: sessionData.refresh_token,
    });
    refreshTokenLoop(sessionData);
  };

  // ----------------------------------------------------------------------

  const signIn = async (data: SignInData): Promise<void> => {
    const session = await services.signIn(data);
    await validateSession(session);
  };

  // ----------------------------------------------------------------------

  const hasPermission = (param: PermissionCheckData): boolean => {
    return state.permissions.some((p) => {
      if (typeof param === 'string') {
        return p.action === param;
      }
      return p.action === param.id;
    });
  };

  const checkPermission = ({ method, permissions }: PermissionCheckParams) => {
    if (method === 'every') {
      return permissions.every((param) => hasPermission(param));
    }
    return permissions.some((param) => hasPermission(param));
  };

  // ----------------------------------------------------------------------

  if (!state.isInitialized) {
    return <LoadingOverlay />;
  }

  return (
    <AuthContext
      value={{
        ...state,
        //
        signIn,
        signOut: reset,
        checkPermission,
      }}
    >
      {children}
    </AuthContext>
  );
}
