import { z } from 'zod/v4';

// ----------------------------------------------------------------------

const envs = z
  .object({
    VITE_HASURA_WSS: z.string().nonempty(),
    VITE_HASURA_HTTPS: z.string().nonempty(),
    VITE_HASURA_CLAIMS_NAMESPACE: z.string().nonempty(),
  })
  .parse(import.meta.env);

// ----------------------------------------------------------------------

export const ENV = {
  HASURA_WSS: envs.VITE_HASURA_WSS,
  HASURA_HTTPS: envs.VITE_HASURA_HTTPS,
  HASURA_CLAIMS_NAMESPACE: envs.VITE_HASURA_CLAIMS_NAMESPACE,
};
