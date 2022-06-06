import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';

const formatRating = (rating, digitsCount = 1) => rating.toFixed(digitsCount);
const getYear = (date) => dayjs(date).format('YYYY');
const formatDate = (date, format) => dayjs(date).format(format);

const getHumanizedDuration = (duration, measure = 'minutes', format = 'H[h] m[m]') => {
  dayjs.extend(durationPlugin);
  return dayjs.duration(duration, measure).format(format);
};

const getRelativeTime = (date) => {
  dayjs.extend(relativeTimePlugin);
  return dayjs().to(dayjs(date));
};

const truncate = (string, maxLength, suffix = '&hellip;') => (
  string.length > maxLength
    ? `${string.substr(0, maxLength - 1)}${suffix}`
    : string
);

const pluralize = (count, noun, renderCount = true, suffix = 's') => {
  noun += count !== 1 ? suffix : '';
  return renderCount ? `${count} ${noun}` : noun;
};

const split3 = (number) => number.toString().split(/(?=(?:...)*$)/).join(' ');

export {
  formatRating,
  getYear,
  formatDate,
  getHumanizedDuration,
  getRelativeTime,
  truncate,
  pluralize,
  split3,
};
