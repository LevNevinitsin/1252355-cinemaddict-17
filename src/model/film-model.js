import { Observable } from 'framework';
import { generateFilms } from 'mock';
import { SortType } from 'const';
import dayjs from 'dayjs';

const FILMS_COUNT = 13;
const RATING_COUNT = 2;
const UPDATE_COUNT = 1;

const sortCallbacksMap = {
  [SortType.DATE_DESC]: (a, b) => (
    dayjs(b.filmInfo.release.date).diff(dayjs(a.filmInfo.release.date))
  ),

  [SortType.RATING_DESC]: (a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating,
  [SortType.COMMENTS_COUNT_DESC]: (a, b) => b.commentsIds.length - a.commentsIds.length,
};

export default class FilmModel extends Observable {
  #films;

  constructor() {
    super();
    this.#films = generateFilms(FILMS_COUNT);
    this.topRatingFilms = this.getFilmsSortedBy(SortType.RATING_DESC).slice(0, RATING_COUNT);

    this.mostCommentedFilms = this.getFilmsSortedBy(SortType.COMMENTS_COUNT_DESC)
      .slice(0, RATING_COUNT);
  }

  get films() {
    return this.#films;
  }

  getFilm = (filmId) => this.#films.find((film) => film.id === filmId);
  getFilmsSortedBy = (sortType) => [...this.#films].sort(sortCallbacksMap[sortType]);

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films.splice(index, UPDATE_COUNT, update);
    this._notify(updateType, update);
  };
}
