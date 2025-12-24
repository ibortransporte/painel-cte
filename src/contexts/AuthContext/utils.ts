import {
  GetAdminDataDocument,
  GetAdminDataQuery,
  GetAdminDataQueryVariables,
  RefreshTokenDocument,
  RefreshTokenQuery,
  RefreshTokenQueryVariables,
  SignInDocument,
  SignInQuery,
  SignInQueryVariables,
} from 'src/@types/generated/types';
import { SessionData, SignInData } from './types';
import { UserData } from 'src/@types/user';
import { getHeadersFromToken } from 'src/utils/auth';
import { PermissionData } from 'src/@types/permission';
import { apolloClient } from 'src/utils/apollo';

// ----------------------------------------------------------------------

export const services = {
  signIn: async (data: SignInData): Promise<SessionData> => {
    const result = await apolloClient.query<SignInQuery, SignInQueryVariables>({
      fetchPolicy: 'no-cache',
      query: SignInDocument,
      variables: {
        email: data.email,
        password: data.password,
      },
    });
    if (!result.data?.admin_signin) throw new Error();

    return result.data.admin_signin;
  },

  getUserData: async ({
    uuid,
    token,
  }: {
    uuid: string;
    token: string;
  }): Promise<{
    user: UserData;
    hasAccess: boolean;
    permissions: PermissionData[];
  }> => {
    const result = await apolloClient.query<
      GetAdminDataQuery,
      GetAdminDataQueryVariables
    >({
      fetchPolicy: 'no-cache',
      query: GetAdminDataDocument,
      variables: { uuid },
      context: { headers: getHeadersFromToken(token) },
    });
    const resultData = result.data;
    if (!resultData?.admin_by_pk || !resultData.admin_fk_profile)
      throw new Error();

    const permissions = resultData.admin_fk_profile.flatMap(
      (profile) => profile.profile.profile_permissions,
    ) as PermissionData[];

    const hasAccess = permissions.some(
      (permission) => permission.action === 'cte_access',
    );

    return {
      user: resultData.admin_by_pk as UserData,
      hasAccess: hasAccess,
      permissions,
    };
  },

  refreshToken: async (refresh_token: string): Promise<string> => {
    const result = await apolloClient.query<
      RefreshTokenQuery,
      RefreshTokenQueryVariables
    >({
      fetchPolicy: 'no-cache',
      query: RefreshTokenDocument,
      variables: { refresh_token },
    });
    if (!result.data?.get_refresh_token) throw new Error();

    return result.data.get_refresh_token.token;
  },
};
