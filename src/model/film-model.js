import { generateFilms } from 'mock';

const FILMS_COUNT = 5;
const TOTAL_COMMENTS_COUNT = 100;
const SortAttribute = {
  RATING: 'rating',
  COMMENTS_COUNT: 'commentsCount',
};

export default class FilmModel {
  constructor() {
    this.films = generateFilms(FILMS_COUNT, TOTAL_COMMENTS_COUNT);
  }

  getFilms = () => this.films;
  getFilm = (filmId) => this.films.find((film) => film.id === filmId);

  getFilmsSortedBy = (attributeName, desc = true) => {
    const sortOrderMultiplier = desc ? 1 : -1;

    const callbacksMap = {
      [SortAttribute.RATING]: (a, b) => (
        sortOrderMultiplier * (b.filmInfo.totalRating - a.filmInfo.totalRating)
      ),

      [SortAttribute.COMMENTS_COUNT]: (a, b) => (
        sortOrderMultiplier * (b.commentsIds.length - a.commentsIds.length)
      ),
    };

    return [...this.films].sort(callbacksMap[attributeName]);
  };
}
