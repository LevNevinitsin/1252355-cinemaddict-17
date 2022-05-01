import {
  getRandomInteger,
  getRandomArrayElement,
  getRandomArrayElements,
  getRandomDate,
} from 'utils';
import { generateParagraph } from 'mock';

const MIN_NUMEROUS_ATTRIBUTE_VALUES_COUNT = 1;
const MAX_WRITERS_COUNT = 3;
const MIN_ACTORS_COUNT = 2;
const MAX_ACTORS_COUNT = 4;
const MAX_GENRES_COUNT = 3;
const MIN_DESCRIPTION_SENTENCES_COUNT = 1;
const MAX_DESCRIPTION_SENTENCES_COUNT = 5;
const MIN_RELEASE_DATE = '1980-01-01';
const MIN_COMMENTS_COUNT = 10;
const MAX_COMMENTS_COUNT = 30;

const generateTitle = () => {
  const titles = [
    'The Artist',
    'Django Unchained',
    'The Dark Knight',
    'Jackie Brown',
    'Blade Runner',
    'Midnight Run',
    'Prisoners',
    'Catch Me If You Can',
    'Rounders',
    'El hoyo',
    'American Gangster',
    'Training Day',
  ];

  return getRandomArrayElement(titles);
};

const generateRating = () => getRandomInteger(0, 9) + getRandomInteger(0, 9) / 10;

const generatePoster = () => {
  const posters = [
    'made-for-each-other.png',
    'popeye-meets-sinbad.png',
    'sagebrush-trail.jpg',
    'santa-claus-conquers-the-martians.jpg',
    'the-dance-of-life.jpg',
    'the-great-flamarion.jpg',
    'the-man-with-the-golden-arm.jpg',
  ];

  return getRandomArrayElement(posters);
};

const generateAgeRating = () => {
  const ages = [0, 6, 12, 16, 18];
  return getRandomArrayElement(ages);
};

const generateDirector = () => {
  const directors = [
    'Michel Hazanavicius',
    'Quentin Tarantino',
    'Christopher Nolan',
    'Ridley Scott',
    'Martin Brest',
    'Denis Villeneuve',
    'Steven Spielberg',
    'John Dahl',
    'Galder Gaztelu-Urrutia',
    'Ridley Scott',
    'Antoine Fuqua',
  ];

  return getRandomArrayElement(directors);
};

const generateWriters = () => {
  const writers = [
    'Michel Hazanavicius',
    'Quentin Tarantino',
    'Jonathan Nolan',
    'Christopher Nolan',
    'David S. Goyer',
    'Elmore Leonard',
    'Hampton Fancher',
    'David Webb Peoples',
    'Philip K. Dick',
    'George Gallo',
    'Aaron Guzikowski',
    'Jeff Nathanson',
    'David Levien',
    'David Desola',
    'Pedro Rivero',
    'Steven Zaillian',
    'Mark Jacobson',
    'David Ayer',
  ];

  return getRandomArrayElements(writers, MIN_NUMEROUS_ATTRIBUTE_VALUES_COUNT, MAX_WRITERS_COUNT);
};

const generateActors = () => {
  const actors = [
    'Jean Dujardin',
    'Bérénice Bejo',
    'John Goodman',
    'Jamie Foxx',
    'Christoph Waltz',
    'Leonardo DiCaprio',
    'Christian Bale',
    'Heath Ledger',
    'Aaron Eckhart',
    'Pam Grier',
    'Samuel L. Jackson',
    'Robert Forster',
    'Harrison Ford',
    'Rutger Hauer',
    'Sean Young',
    'Robert De Niro',
    'Hugh Jackman',
    'Jake Gyllenhaal',
    'Tom Hanks',
    'Christopher Walken',
    'Ivan Massagué',
    'Zorion Eguileor',
    'Antonia San Juan',
    'Matt Damon',
    'Edward Norton',
    'Denzel Washington',
    'Russell Crowe',
    'Chiwetel Ejiofor',
    'Ethan Hawke',
    'Scott Glenn',
  ];

  return getRandomArrayElements(actors, MIN_ACTORS_COUNT, MAX_ACTORS_COUNT);
};

const generateReleaseDate = () => getRandomDate(new Date(MIN_RELEASE_DATE)).toISOString();

const generateCountry = () => {
  const countries = ['USA', 'Spain', 'France', 'Belgium'];
  return getRandomArrayElement(countries);
};

const generateGenres = () => {
  const genres = ['Comedy', 'Drama', 'Horror', 'Sci-fi', 'Thriller', 'Western', 'Action'];
  return getRandomArrayElements(genres, MIN_NUMEROUS_ATTRIBUTE_VALUES_COUNT, MAX_GENRES_COUNT);
};

const generateDescription = () => (
  generateParagraph(
    getRandomInteger(MIN_DESCRIPTION_SENTENCES_COUNT, MAX_DESCRIPTION_SENTENCES_COUNT)
  )
);

const generateWatchingDate = (releaseDate) => getRandomDate(new Date(releaseDate)).toISOString();

let id = 1;

const generateFilm = (filmCommentsIds) => {
  const releaseDate = generateReleaseDate();
  const isInWatchlist = Boolean(getRandomInteger(0, 1));
  const hasAlreadyWatched = isInWatchlist ? false : Boolean(getRandomInteger(0, 1));

  return {
    id: id++,
    commentsIds: filmCommentsIds,
    filmInfo: {
      title: generateTitle(),
      alternativeTitle: generateTitle(),
      totalRating: generateRating(),
      poster: `images/posters/${generatePoster()}`,
      ageRating: generateAgeRating(),
      director: generateDirector(),
      writers: generateWriters(),
      actors: generateActors(),
      release: {
        date: releaseDate,
        releaseCountry: generateCountry(),
      },
      runtime: getRandomInteger(90, 180),
      genre: generateGenres(),
      description: generateDescription(),
    },
    userDetails: {
      watchlist: isInWatchlist,
      alreadyWatched: hasAlreadyWatched,
      watchingDate: generateWatchingDate(releaseDate),
      favorite: Boolean(getRandomInteger(0, 1)),
    },
  };
};

export const generateFilms = (filmsCount, commentsCount) => {
  const films = [];
  let commentId = 1;
  const commentsIds = Array.from({ length: commentsCount }, () => commentId++);

  for (let i = 0; i < filmsCount; i++) {
    const maxCommentsCount = Math.min(commentsIds.length, MAX_COMMENTS_COUNT);

    const filmCommentsIds = getRandomArrayElements(
      commentsIds,
      MIN_COMMENTS_COUNT,
      maxCommentsCount,
      true
    );

    films.push(generateFilm(filmCommentsIds));
  }

  return films;
};
