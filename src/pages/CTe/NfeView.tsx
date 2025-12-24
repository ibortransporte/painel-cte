import {
  errorHandler,
  PanelBase,
  Scrollable,
  TextOverflow,
  toast,
} from '@fluxu-labs/lib';
import { NfData, services } from './utils';
import { Alert, Button, Stack, SxProps, Typography } from '@mui/material';
import { format } from 'date-fns';
import { formatCurrency, formatWeight } from 'src/utils/format';
import { useAuthContext } from 'src/hooks/useAuthContext';
import { useState } from 'react';

// ----------------------------------------------------------------------

export function NfeView({
  data,
  onClose,
}: {
  data: NfData;
  onClose: () => void;
}) {
  const { user } = useAuthContext();

  // ----------------------------------------------------------------------

  const [isProcessing, setIsProcessing] = useState(false);

  const lockNf = async () => {
    setIsProcessing(true);
    try {
      await services.insertLock({
        nf: data.numero_nf,
        user_uuid: user?.uuid as string,
      });
    } catch (error) {
      errorHandler({ error });
    }
    setTimeout(() => setIsProcessing(false), 500);
  };

  const unlockNf = async () => {
    setIsProcessing(true);
    try {
      await services.deleteLock({ nf: data.numero_nf });
    } catch (error) {
      errorHandler({ error });
    }
    setTimeout(() => setIsProcessing(false), 500);
  };

  // ----------------------------------------------------------------------

  return (
    <PanelBase.Container floating processing={isProcessing}>
      <PanelBase.Header2
        content="Visualizar NFe"
        actions={<PanelBase.Button.Close onClick={onClose} />}
      />

      <Scrollable sx={{ p: 1, gap: 1.5, pt: 0 }}>
        {!!data.locked && (
          <Alert severity="info">
            Esta NF está alocada por {data.locked.admin.name}
          </Alert>
        )}

        <Typography sx={{ color: 'text.secondary' }}>
          Clique sobre os dados para copiá-los
        </Typography>

        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <DataItem label="Número" value={data.numero_nf} />
          <DataItem label="Série" value={data.serie_nf} sx={{ width: 100 }} />
        </Stack>
        <DataItem label="Chave" value={data.chave_nf} />
        <DataItem label="CNPJ Destinatário" value={data.cnpj_destinatario} />
        <DataItem label="CNPJ Remetente" value={data.cnpj_remetente} />
        <DataItem
          label="Data NF"
          value={format(data.data_nf, 'dd/MM/yyyy HH:mm')}
        />
        <DataItem label="Endereço" value={data.endereco_destino} />
        <DataItem label="Observação" value={data.observacao} />
        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <DataItem label="Peso" value={formatWeight(data.peso)} />
          <DataItem
            label="Valor"
            value={formatCurrency(data.valor_nf)}
            sx={{ width: 100 }}
          />
        </Stack>

        <PanelBase.Section title="Ações">
          {data.locked ? (
            <Button
              variant="contained"
              size="small"
              color="warning"
              onClick={() => void unlockNf()}
            >
              Desalocar CTe
            </Button>
          ) : (
            <Button
              variant="contained"
              size="small"
              onClick={() => void lockNf()}
            >
              Alocar CTe
            </Button>
          )}
        </PanelBase.Section>
      </Scrollable>
    </PanelBase.Container>
  );
}

// ----------------------------------------------------------------------

function DataItem({
  label,
  value,
  sx,
}: {
  label: string;
  value: string | number | null;
  sx?: SxProps;
}) {
  return (
    <Stack
      onClick={() => {
        void navigator.clipboard.writeText(String(value || ''));
        toast.info('Dado copiado!');
      }}
      sx={{ gap: 0.25, cursor: 'pointer', ...sx }}
    >
      <Typography sx={{ color: 'text.secondary' }}>{label}</Typography>
      <TextOverflow>{String(value || '-')}</TextOverflow>
    </Stack>
  );
}
