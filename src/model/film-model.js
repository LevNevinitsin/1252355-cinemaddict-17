import { generateFilms } from 'mock';

const FILMS_COUNT = 13;
const RATING_COUNT = 2;

const SortAttribute = {
  RATING: 'rating',
  COMMENTS_COUNT: 'commentsCount',
};

const sortCallbacksMap = {
  [SortAttribute.RATING]: (a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating,
  [SortAttribute.COMMENTS_COUNT]: (a, b) => b.commentsIds.length - a.commentsIds.length,
};

export default class FilmModel {
  #films;

  constructor() {
    this.#films = generateFilms(FILMS_COUNT);
    this.topRatingFilms = this.getFilmsSortedBy(SortAttribute.RATING).slice(0, RATING_COUNT);

    this.mostCommentedFilms = this.getFilmsSortedBy(SortAttribute.COMMENTS_COUNT)
      .slice(0, RATING_COUNT);
  }

  get films() {
    return this.#films;
  }

  getFilm = (filmId) => this.#films.find((film) => film.id === filmId);
  getFilmsSortedBy = (attributeName) => [...this.#films].sort(sortCallbacksMap[attributeName]);
}
