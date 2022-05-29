import { render, replace, remove } from 'framework';
import { FilmItemView } from 'view';
import { CallbackName, UserAction, UpdateType } from 'const';

export default class FilmPresenter {
  #container = null;
  #changeData = null;

  #film = null;
  #filmComponent = null;
  #callbacksMap = null;

  constructor (
    container, changeData
  ) {
    this.#container = container;
    this.#changeData = changeData;

    this.#callbacksMap = {
      [CallbackName.WATCHLIST_CLICK]: this.#handleWatchlistClick,
      [CallbackName.WATCHED_CLICK]: this.#handleWatchedClick,
      [CallbackName.FAVORITE_CLICK]: this.#handleFavoriteClick,
    };
  }

  get filmComponent() {
    return this.#filmComponent;
  }

  init = (film) => {
    this.#film = film;
    const prevFilmComponent = this.#filmComponent;
    this.#filmComponent = new FilmItemView(film);
    this.#filmComponent.setHandlers(this.#callbacksMap);

    if (prevFilmComponent === null) {
      render(this.#filmComponent, this.#container);
      return;
    }

    if (this.#container.contains(prevFilmComponent.element)) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    prevFilmComponent.removeHandlers();
    remove(prevFilmComponent);
  };

  destroy = () => {
    remove(this.#filmComponent);
  };

  #handleWatchlistClick = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, this.#film);
  };

  #handleWatchedClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.SUPERMINOR, this.#film);
  };

  #handleFavoriteClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, this.#film);
  };
}
