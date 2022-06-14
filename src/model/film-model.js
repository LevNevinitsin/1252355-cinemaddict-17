import { Observable } from 'framework';
import { SortType, UpdateType } from 'const';
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

  static sortFilms = (films, sortType) => [...films].sort(sortCallbacksMap[sortType]);

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
}
