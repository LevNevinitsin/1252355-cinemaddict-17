import { getRandomInteger, getRandomArrayElement, getRandomDate } from 'utils';
import { generateParagraph } from 'mock';

const MIN_DATE = '2022-01-01';
const MIN_COMMENT_SENTENCES_COUNT = 1;
const MAX_COMMENT_SENTENCES_COUNT = 2;

const generateAuthor = () => {
  const names = ['Ilya', 'Ivan', 'Sergey', 'John', 'Alexey', 'Nick', 'James', 'Hans', 'Glenn'];
  const surnames = ['Petrov', 'Smith', 'Cameron', 'Zimmer', 'Stafford', 'Uelmen', 'Williams'];
  return `${getRandomArrayElement(names)} ${getRandomArrayElement(surnames)}`;
};

const generateCommentText = () => (
  generateParagraph(getRandomInteger(MIN_COMMENT_SENTENCES_COUNT, MAX_COMMENT_SENTENCES_COUNT))
);

const generateDate = () => getRandomDate(new Date(MIN_DATE)).toISOString();

const generateEmotion = () => {
  const emotions = ['smile', 'sleeping', 'puke', 'angry'];
  return getRandomArrayElement(emotions);
};

export const generateComment = (commentId) => (
  {
    id: commentId,
    author: generateAuthor(),
    comment: generateCommentText(),
    date: generateDate(),
    emotion: generateEmotion(),
  }
);

export const generateComments = (filmCommentsIds) => {
  const comments = [];

  for (let i = 0; i < filmCommentsIds.length; i++) {
    comments.push(generateComment(filmCommentsIds[i]));
  }

  return comments;
};
