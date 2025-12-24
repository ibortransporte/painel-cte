import { PermissionCheckParams, PermissionData } from 'src/@types/permission';
import { UserData } from 'src/@types/user';

// ----------------------------------------------------------------------

export type AuthContextState = {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: UserData | null;
  permissions: PermissionData[];
};

export type AuthContextProps = {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: UserData | null;
  permissions: PermissionData[];
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => Promise<void>;
  checkPermission: (params: PermissionCheckParams) => boolean;
};

//

export type AuthContext_Storage = {
  token: string;
  refresh_token: string;
};

// ----------------------------------------------------------------------

export type SignInData = {
  email: string;
  password: string;
};

export type SessionData = {
  token: string;
  refresh_token: string;
};
