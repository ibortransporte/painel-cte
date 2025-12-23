import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Stack, SxProps } from '@mui/material';
import {
  faTruck,
  faRoute,
  faWeightHanging,
  faCircleDollar,
  faHandHoldingDollar,
  faXmark,
  faBox,
  faCalendar,
  faWarehouse,
  faChevronLeft,
  faChevronRight,
  faUser,
  faIdCard,
  faLocationDot,
  faMap,
  faKey,
  faCarBattery,
  faClock,
  faSignal,
  faSignalStrong,
  faSignalGood,
  faSignalFair,
  faSignalWeak,
  faHourglassStart,
  faStop,
  faPowerOff,
  faGear,
  faRightFromBracket,
  faReceipt,
  faEarthAmericas,
  faBars,
  faEye,
  faEyeSlash,
  faStarfighterTwinIonEngine,
  faArrowUpRightFromSquare,
  faWarning,
  faFile,
  faExpand,
  faHighDefinition,
  faVolume,
  faVolumeSlash,
  faVideo,
  faMinus,
  faRotate,
  faSatellite,
  faCompress,
  faPlus,
  faDrawPolygon,
  faHand,
} from '@fortawesome/pro-light-svg-icons';

// ----------------------------------------------------------------------

const iconMap = {
  axle: faStarfighterTwinIonEngine,
  box: faBox,
  truck: faTruck,
  weight: faWeightHanging,
  route: faRoute,
  currency: faCircleDollar,
  currencyTax: faHandHoldingDollar,
  close: faXmark,
  calendar: faCalendar,
  clock: faClock,
  drag: faBars,
  earth: faEarthAmericas,
  elapsedTime: faHourglassStart,
  warehouse: faWarehouse,
  fullscreen: faExpand,
  chevronLeft: faChevronLeft,
  chevronRight: faChevronRight,
  user: faUser,
  rotate: faRotate,
  visibility: faEye,
  visibilityOff: faEyeSlash,
  videoQuality: faHighDefinition,
  driver: faIdCard,
  location: faLocationDot,
  map: faMap,
  stream: faVideo,
  minus: faMinus,
  key: faKey,
  keyOff: faPowerOff,
  stop: faStop,
  signOut: faRightFromBracket,
  open: faArrowUpRightFromSquare,
  settings: faGear,
  receipt: faReceipt,
  volume: faVolume,
  volumeOff: faVolumeSlash,
  battery: faCarBattery,
  warning: faWarning,
  at: faFile,
  signal5: faSignal,
  signal4: faSignalStrong,
  signal3: faSignalGood,
  signal2: faSignalFair,
  signal1: faSignalWeak,
  satellite: faSatellite,
  fullscreenOn: faExpand,
  fullscreenOff: faCompress,
  zoomIn: faPlus,
  zoomOut: faMinus,
  drawHand: faHand,
  drawPolygon: faDrawPolygon,
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
