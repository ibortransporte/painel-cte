import {
  DeleteNfLockDocument,
  DeleteNfLockMutation,
  DeleteNfLockMutationVariables,
  GetNfsPendingCteDocument,
  GetNfsPendingCteQuery,
  GetNfsPendingCteQueryVariables,
  InsertNfLockDocument,
  InsertNfLockMutation,
  InsertNfLockMutationVariables,
} from 'src/@types/generated/types';
import { apolloClient } from 'src/utils/apollo';

// ----------------------------------------------------------------------

export type NfData = {
  numero_nf: number;
  cnpj_remetente: string;
  cnpj_destinatario: string;
  observacao: string | null;
  endereco_destino: string;
  serie_nf: number;
  data_nf: Date;
  peso: number;
  valor_nf: number;
  chave_nf: string;
  locked?: {
    user_uuid: string;
    admin: {
      name: string;
    };
  };
};

// ----------------------------------------------------------------------

export const services = {
  getNfsPendingCte: async (): Promise<NfData[]> => {
    const data = await apolloClient.query<
      GetNfsPendingCteQuery,
      GetNfsPendingCteQueryVariables
    >({
      query: GetNfsPendingCteDocument,
    });
    return (data.data?.getNfsPendingCte || []).flatMap((item) =>
      item
        ? {
            ...item,
            data_nf: new Date(item.data_nf),
          }
        : [],
    );
  },

  insertLock: async ({ nf, user_uuid }: { nf: number; user_uuid: string }) => {
    await apolloClient.mutate<
      InsertNfLockMutation,
      InsertNfLockMutationVariables
    >({
      mutation: InsertNfLockDocument,
      variables: {
        data: { nf, user_uuid, locked_at: new Date() },
      },
    });
  },

  deleteLock: async ({ nf }: { nf: number }) => {
    await apolloClient.mutate<
      DeleteNfLockMutation,
      DeleteNfLockMutationVariables
    >({
      mutation: DeleteNfLockDocument,
      variables: { nf },
    });
  },
};
