import { getRandomInteger, getRandomArrayElement, getRandomDate } from 'utils';
import { generateParagraph } from 'mock';

const MIN_DATE = '2022-01-01';
const MIN_COMMENT_SENTENCES_COUNT = 1;
const MAX_COMMENT_SENTENCES_COUNT = 2;
const names = ['Ilya', 'Ivan', 'Sergey', 'John', 'Alexey', 'Nick', 'James', 'Hans', 'Glenn'];
const surnames = ['Petrov', 'Smith', 'Cameron', 'Zimmer', 'Stafford', 'Uelmen', 'Williams'];
const emotions = ['smile', 'sleeping', 'puke', 'angry'];

const generateAuthor = () => `${getRandomArrayElement(names)} ${getRandomArrayElement(surnames)}`;

const generateCommentText = () => (
  generateParagraph(getRandomInteger(MIN_COMMENT_SENTENCES_COUNT, MAX_COMMENT_SENTENCES_COUNT))
);

const generateDate = () => getRandomDate(new Date(MIN_DATE)).toISOString();
const generateEmotion = () => getRandomArrayElement(emotions);

export const generateComment = (commentId) => (
  {
    id: commentId,
    author: generateAuthor(),
    comment: generateCommentText(),
    date: generateDate(),
    emotion: generateEmotion(),
  }
);

export const generateComments = (filmCommentsIds) => (
  filmCommentsIds.map((commentId) => generateComment(commentId))
);
