import {
  add,
  formatDuration,
  intervalToDuration,
  setMilliseconds,
  setSeconds,
} from 'date-fns';
import {
  FormatDistanceToken,
  FormatRelativeToken,
  Locale,
  ptBR,
} from 'date-fns/locale';
import parsePgInterval from 'postgres-interval';

// ----------------------------------------------------------------------

const formatRelativeWithoutTimeTokens: {
  [key in FormatRelativeToken]: string;
} = {
  lastWeek: 'dd/MM/yyyy',
  yesterday: "'Ontem'",
  today: "'Hoje'",
  tomorrow: "'Amanhã'",
  nextWeek: 'dd/MM/yyyy',
  other: 'dd/MM/yyyy',
};

const formatRelativeWithoutTime: Pick<
  Locale,
  'options' | 'localize' | 'formatLong' | 'formatRelative'
> = {
  ...ptBR,
  formatRelative: (token) => formatRelativeWithoutTimeTokens[token],
};

// ----------------------------------------------------------------------

const formatDurationShortTokens: { [key in FormatDistanceToken]: string } = {
  lessThanXSeconds: '{{count}}s',
  xSeconds: '{{count}}s',
  halfAMinute: '30s',
  lessThanXMinutes: '{{count}}m',
  xMinutes: '{{count}}m',
  aboutXHours: '{{count}}h',
  xHours: '{{count}}h',
  xDays: '{{count}}d',
  aboutXWeeks: '{{count}}w',
  xWeeks: '{{count}}w',
  aboutXMonths: '{{count}}m',
  xMonths: '{{count}}m',
  aboutXYears: '{{count}}y',
  xYears: '{{count}}y',
  overXYears: '{{count}}y',
  almostXYears: '{{count}}y',
};

const formatDurationShort: Pick<
  Locale,
  'options' | 'localize' | 'formatDistance'
> = {
  ...ptBR,
  formatDistance: (token, count) =>
    formatDurationShortTokens[token].replace('{{count}}', String(count)),
};

// ----------------------------------------------------------------------

export const dateFnsLocales = {
  formatDurationShort,
  formatRelativeWithoutTime,
};

// ----------------------------------------------------------------------

export const formatTimeDiff = (diff: number) => {
  return formatDuration(intervalToDuration({ start: 0, end: diff }), {
    format: ['days', 'hours', 'minutes'],
    locale: dateFnsLocales.formatDurationShort,
  });
};

// ----------------------------------------------------------------------

export const addPgIntervalToDate = ({
  date,
  pgInterval,
}: {
  date: Date;
  pgInterval: string;
}) => {
  const parsed = parsePgInterval(pgInterval);

  return setMilliseconds(
    setSeconds(
      add(new Date(date), {
        years: parsed.years,
        months: parsed.months,
        days: parsed.days,
        hours: parsed.hours,
        minutes: parsed.minutes,
      }),
      0,
    ),
    0,
  );
};
