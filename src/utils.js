import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';
import { customAlphabet } from 'nanoid/non-secure';

const UPDATE_COUNT = 1;

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

const getRandomDate = (start, end = new Date()) => {
  const startTimestamp = start.getTime();
  return new Date(startTimestamp + Math.random() * (end.getTime() - startTimestamp));
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

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayElement = (array) => array[getRandomInteger(0, array.length - 1)];
const pullElement = (array, index) => array.splice(index, 1)[0];

const pullRandomArrayElement = (array) => (
  pullElement(array, getRandomInteger(0, array.length - 1))
);

/**
 * Gets / pulls random elements from array
 *
 * @param {array} array source array
 * @param {int} minCount minimum desired amount of elements
 * @param {int} maxCount maximum desired amount of elements. If minCount !== maxCount, function
 * will return random number of elements between minCount and maxCount
 * @param {bool} pull if true, will exclude chosen elements from source array. Works only if
 * getUnique parameter is true
 * @param {bool} getUnique if true, will return only unique elements
 *
 * @returns {array} result
 */
const getRandomArrayElements = (
  array,
  minCount,
  maxCount = minCount,
  pull = false,
  getUnique = true,
) => {
  const count = Math.min(
    minCount === maxCount ? minCount : getRandomInteger(minCount, maxCount),
    array.length
  );

  const result = [];

  if (getUnique) {
    const elements = pull ? array : [...array];

    for (let i = 0; i < count; i++) {
      result.push(pullRandomArrayElement(elements));
    }

    return result;
  }

  for (let i = 0; i < count; i++) {
    result.push(getRandomArrayElement(array));
  }

  return result;
};

const getRandomId = (alphabet = '01234567890', length = 10) => {
  const nanoid = customAlphabet(alphabet, length);
  return nanoid();
};

const split3 = (number) => number.toString().split(/(?=(?:...)*$)/).join(' ');

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index !== -1) {
    items.splice(index, UPDATE_COUNT, update);
  }
};

export {
  formatRating,
  getYear,
  formatDate,
  getHumanizedDuration,
  getRelativeTime,
  getRandomDate,
  truncate,
  pluralize,
  getRandomInteger,
  getRandomArrayElement,
  getRandomArrayElements,
  getRandomId,
  split3,
  updateItem,
};
