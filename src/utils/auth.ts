import { jwtDecode } from 'jwt-decode';
import { AuthContext_Storage } from 'src/contexts/AuthContext/types';
import { StorageKey } from './storage';
import { ENV } from 'src/env';

// ----------------------------------------------------------------------

type HasuraUserRole = 'manager';

type HasuraClaims = {
  'x-hasura-user-id': string;
  'x-hasura-default-role': HasuraUserRole;
  'x-hasura-allowed-roles': HasuraUserRole[];
};

type DecodedToken = {
  [key: string]: HasuraClaims;
} & {
  iat: number;
  exp: number;
};

type DeserializedClaims = {
  userUuid: string;
  defaultRole: string;
  allowedRoles: string[];
};

type DeserializedToken = {
  claims: DeserializedClaims;
  exp: number;
};

// ----------------------------------------------------------------------

const deserializeToken = (token: string): DeserializedToken | null => {
  const decoded = jwtDecode<DecodedToken>(token);

  // get claims inside the hasura namespace key
  const claims = decoded[ENV.HASURA_CLAIMS_NAMESPACE];
  if (!claims) return null;

  const deserializeClaims = (
    decodedToken: HasuraClaims,
  ): DeserializedClaims => {
    return {
      userUuid: decodedToken['x-hasura-user-id'],
      defaultRole: decodedToken['x-hasura-default-role'],
      allowedRoles: decodedToken['x-hasura-allowed-roles'],
    };
  };

  return { claims: deserializeClaims(claims), exp: decoded.exp };
};

const getHeadersFromToken = (token: string): { [key: string]: string } => {
  const deserializedToken = deserializeToken(token);
  if (!deserializedToken) return {};
  return {
    authorization: `Bearer ${token}`,
    'x-hasura-role': deserializedToken?.claims.defaultRole,
  };
};

const getLocalStorageToken = (): string | null => {
  const raw = localStorage.getItem(StorageKey['auth-context']);
  if (!raw) return null;
  const stored = JSON.parse(raw) as AuthContext_Storage;
  return stored.token;
};

// ----------------------------------------------------------------------

export { deserializeToken, getHeadersFromToken, getLocalStorageToken };
