import { Observable } from 'framework';
import { SortType, UpdateType } from 'const';
import { getUniqueRandomArrayElements } from 'utils';
import dayjs from 'dayjs';

const UPDATE_COUNT = 1;

const sortCallbacksMap = {
  [SortType.DATE_DESC]: (a, b) => (
    dayjs(b.filmInfo.release.date).diff(dayjs(a.filmInfo.release.date))
  ),

  [SortType.RATING_DESC]: (a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating,
  [SortType.COMMENTS_COUNT_DESC]: (a, b) => b.commentsIds.length - a.commentsIds.length,
};

export default class FilmModel extends Observable {
  #filmsApiService = null;
  #films = [];

  conditionsMap = {
    [SortType.RATING_DESC]: {},
    [SortType.COMMENTS_COUNT_DESC]: {},
  };

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  get films() {
    return this.#films;
  }

  init = async () => {
    try {
      this.#films = await this.#filmsApiService.films;
    } catch(err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT);
  };

  getFilm = (filmId) => this.#films.find((film) => film.id === filmId);

  static sortFilms = (films, sortType, filmModel) => {
    const sortedFilms = [...films].sort(sortCallbacksMap[sortType]);
    const filmsCount = films.length;

    if (sortType === SortType.RATING_DESC) {
      filmModel.conditionsMap[sortType].areEqual = sortedFilms[0].filmInfo.totalRating
        === sortedFilms[filmsCount - 1].filmInfo.totalRating;

      filmModel.conditionsMap[sortType].hasValue = sortedFilms[0].filmInfo.totalRating !== 0;
    }

    if (sortType === SortType.COMMENTS_COUNT_DESC) {
      filmModel.conditionsMap[sortType].areEqual = sortedFilms[0].commentsIds.length
        === sortedFilms[filmsCount - 1].commentsIds.length;

      filmModel.conditionsMap[sortType].hasValue = sortedFilms[0].commentsIds.length > 0;
    }

    return sortedFilms;
  };

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const updatedFilm = await this.#filmsApiService.updateFilm(update);
      this.#films.splice(index, UPDATE_COUNT, updatedFilm);
      this._notify(updateType, updatedFilm);
    } catch(err) {
      throw new Error('Can\'t update film');
    }
  };

  setFilmCommentsIds = (filmId, commentsIds) => {
    const film = this.getFilm(filmId);
    film.commentsIds = commentsIds;
    this._notify(UpdateType.SUPERPATCH, film);
  };

  hasSomeRating = () => this.conditionsMap[SortType.RATING_DESC].hasValue;

  hasSomeCommentsCount = () => this.conditionsMap[SortType.COMMENTS_COUNT_DESC].hasValue;

  areAllRatingsEqual = () => this.conditionsMap[SortType.RATING_DESC].areEqual;

  areAllCommentsCountsEqual = () => this.conditionsMap[SortType.COMMENTS_COUNT_DESC].areEqual;

  getRandomFilms = (count) => getUniqueRandomArrayElements(this.films, count);
}
