import { faCalendar, faReceipt } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Stack, SxProps } from '@mui/material';

// ----------------------------------------------------------------------

const iconMap = {
  nfe: faReceipt,
  calendar: faCalendar,
};

export type FAIconName = keyof typeof iconMap;

// ----------------------------------------------------------------------

export function FAIcon({
  icon,
  color,
  fontSize = 14,
  sx,
}: {
  icon: FAIconName;
  color?: string;
  fontSize?: number;
  sx?: SxProps;
}) {
  return (
    <Stack
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        width: fontSize,
        height: fontSize,
        ...sx,
      }}
    >
      <FontAwesomeIcon icon={iconMap[icon]} color={color} fontSize={fontSize} />
    </Stack>
  );
}
