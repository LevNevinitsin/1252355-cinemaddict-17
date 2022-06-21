import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';
import { random } from 'lodash';

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

const getUniqueRandomArrayElements = (array, count) => {
  const arrayLength = array.length;

  if (count > arrayLength) {
    throw new Error('Count is too big');
  }

  const result = [];
  const elements = [...array];

  for (let i = 0; i < count; i++) {
    result.push(elements.splice(random(arrayLength - 1), 1)[0]);
  }

  return result;
};

export {
  formatRating,
  getYear,
  formatDate,
  getHumanizedDuration,
  getRelativeTime,
  truncate,
  pluralize,
  split3,
  getUniqueRandomArrayElements,
};
