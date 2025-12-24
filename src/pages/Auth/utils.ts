import { FormNullable } from '@fluxu-labs/lib';
import { SignInData } from 'src/contexts/AuthContext/types';
import { z } from 'zod';

// ----------------------------------------------------------------------

export const AuthSchema: z.ZodType<
  SignInData,
  FormNullable<SignInData>
> = z.object({
  email: z.string().nonempty(),
  password: z.string().nonempty(),
});
