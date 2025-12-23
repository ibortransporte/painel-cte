import { z } from 'zod/v4';

// ----------------------------------------------------------------------

const envs = z
  .object({
    VITE_MAPBOX_ACCESS_TOKEN: z.string().nonempty(),
    VITE_GOOGLE_MAPS_API_KEY: z.string().nonempty(),
    //
    VITE_HASURA_WSS: z.string().nonempty(),
    VITE_HASURA_HTTPS: z.string().nonempty(),
    VITE_HASURA_ADMIN_SECRET: z.string().nonempty(),
  })
  .parse(import.meta.env);

// ----------------------------------------------------------------------

export const ENV = {
  MAPBOX_ACCESS_TOKEN: envs.VITE_MAPBOX_ACCESS_TOKEN,
  GOOGLE_MAPS_API_KEY: envs.VITE_GOOGLE_MAPS_API_KEY,
  //
  HASURA_WSS: envs.VITE_HASURA_WSS,
  HASURA_HTTPS: envs.VITE_HASURA_HTTPS,
  HASURA_ADMIN_SECRET: envs.VITE_HASURA_ADMIN_SECRET,
};
