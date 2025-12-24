import { useSubscription } from '@apollo/client/react';
import {
  CheckboxInput,
  errorHandler,
  LibFAIcon,
  PanelBase,
  SearchInput,
  stringMatch,
} from '@fluxu-labs/lib';
import { Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { SubGetLockedNfsDocument } from 'src/@types/generated/types';
import { FAIcon } from 'src/components/FAIcon';
import { useAuthContext } from 'src/hooks/useAuthContext';
import { formatCurrency } from 'src/utils/format';
import { NfeView } from './NfeView';
import { NfData, services } from './utils';

// ----------------------------------------------------------------------

export default function CTe() {
  const { user } = useAuthContext();

  // ----------------------------------------------------------------------

  const [isLoading, setIsLoading] = useState(true);
  const { data: lockedNfs, loading: isLoadingLockedNfs } = useSubscription(
    SubGetLockedNfsDocument,
  );

  const [nfsPendingCteRaw, setNfsPendingCteRaw] = useState<NfData[]>([]);

  //

  const [currentData, setCurrentData] = useState<NfData | null>(null);

  const openNfe = (data: NfData) => {
    setCurrentData(data);
  };

  const closeNfe = () => {
    setCurrentData(null);
  };

  //

  const nfsPendingCte = useMemo(() => {
    const updated = nfsPendingCteRaw.map((item) => {
      const locked = lockedNfs?.cte_nf_lock.find(
        (lock) => lock.nf === item.numero_nf,
      );
      if (locked) {
        return {
          ...item,
          locked: {
            user_uuid: locked.user_uuid,
            admin: { name: locked.admin.name },
          },
        };
      }
      return item;
    });
    if (currentData) {
      const newData = updated.find(
        (item) => item.numero_nf === currentData.numero_nf,
      );
      if (newData) setCurrentData(newData);
    }
    return updated;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nfsPendingCteRaw, lockedNfs]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await services.getNfsPendingCte();
        setNfsPendingCteRaw(data);
      } catch (error) {
        errorHandler({ error });
      }
      setIsLoading(false);
    };
    void fetchData();
    const interval = window.setInterval(() => void fetchData(), 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  // ----------------------------------------------------------------------

  // ----------------------------------------------------------------------

  const [searchString, setSearchString] = useState('');
  const [searchMine, setSearchMine] = useState(false);

  const dataFiltered = useMemo(
    () =>
      applyFilter({ data: nfsPendingCte, searchString }).filter(
        (item) =>
          !searchMine || item.locked?.user_uuid === (user?.uuid as string),
      ),
    [nfsPendingCte, searchString, searchMine, user],
  );

  // ----------------------------------------------------------------------

  return (
    <PanelBase.Root floating>
      <PanelBase.Container floating processing={isLoadingLockedNfs}>
        <PanelBase.Header2
          content="NFs pendente de CTe"
          actions={
            <CheckboxInput
              label="Apenas minhas"
              labelPlacement="start"
              checked={searchMine}
              onChange={(e) => setSearchMine(e.target.checked)}
            />
          }
          bottomComponent={
            <SearchInput
              searchString={searchString}
              setSearchString={setSearchString}
            />
          }
        />

        <PanelBase.VirtualLazyList
          items={dataFiltered}
          loading={isLoading}
          estimateSize={215}
          renderItem={({ item }) => (
            <PanelBase.ListItem
              onClick={() => openNfe(item)}
              sx={{ p: 1, gap: 1 }}
            >
              <Stack
                sx={{
                  flexDirection: 'row',
                  gap: 2,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Stack
                  sx={{ flexDirection: 'row', gap: 0.5, alignItems: 'center' }}
                >
                  <FAIcon icon="nfe" />
                  <Typography>{item.numero_nf}</Typography>
                </Stack>

                <Stack
                  sx={{ flexDirection: 'row', gap: 0.5, alignItems: 'center' }}
                >
                  <FAIcon icon="calendar" />
                  <Typography>
                    {format(item.data_nf, 'dd/MM/yyyy HH:mm')}
                  </Typography>
                </Stack>
              </Stack>

              <Stack
                sx={{
                  flexDirection: 'row',
                  gap: 2,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography>{formatCurrency(item.valor_nf)}</Typography>

                <Typography>{item.cnpj_destinatario}</Typography>
              </Stack>

              {!!item.locked && (
                <Stack
                  sx={{
                    flexDirection: 'row',
                    gap: 0.5,
                    alignItems: 'center',
                    color: (theme) => theme.palette.info.main,
                  }}
                >
                  <LibFAIcon icon="user" />
                  <Typography>{item.locked?.admin.name}</Typography>
                </Stack>
              )}
            </PanelBase.ListItem>
          )}
        />
      </PanelBase.Container>

      {!!currentData && (
        <NfeView
          key={currentData.numero_nf + String(currentData.locked?.user_uuid)}
          data={currentData}
          onClose={closeNfe}
        />
      )}
    </PanelBase.Root>
  );
}

// ----------------------------------------------------------------------

const applyFilter = ({
  data,
  searchString,
}: {
  data: NfData[];
  searchString: string;
}) => {
  // filter
  if (searchString) {
    data = data.filter((item) =>
      stringMatch(
        [item.numero_nf, item.cnpj_destinatario, item.cnpj_remetente].join(';'),
        searchString,
      ),
    );
  }

  return data;
};
