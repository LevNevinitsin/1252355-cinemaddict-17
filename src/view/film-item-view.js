import { AbstractStatefulView } from 'frameworkView';
import { formatRating, getYear, getHumanizedDuration, truncate, pluralize } from 'utils';
import { CallbackName } from 'const';
import cn from 'classnames';

const MAX_DESCRIPTION_LENGTH = 140;
const GENRE_DEFAULT_NUMBER = 0;

const BUTTON_BASE_CLASS = 'film-card__controls-item';
const buttonWatchlistClass = `${BUTTON_BASE_CLASS}--add-to-watchlist`;
const buttonWatchedClass = `${BUTTON_BASE_CLASS}--mark-as-watched`;
const buttonFavoriteClass = `${BUTTON_BASE_CLASS}--favorite`;
const buttonActiveClass = `${BUTTON_BASE_CLASS}--active`;

const createFilmItemTemplate = (film, { isDisabled }) => {
  const commentsCount = film.commentsIds.length;

  const {
    title,
    totalRating,
    poster,
    release,
    runtime,
    genre: genres,
    description,
  } = film.filmInfo;

  const {
    watchlist: isInWatchlist,
    alreadyWatched: hasAlreadyWatched,
    favorite: isFavorite
  } = film.userDetails;

  const rating = formatRating(totalRating);
  const releaseYear = getYear(release.date);
  const runtimeHumanized = getHumanizedDuration(runtime);
  const genresText = genres[GENRE_DEFAULT_NUMBER];
  const descriptionShort = truncate(description, MAX_DESCRIPTION_LENGTH);
  const commentsInfo = pluralize(commentsCount, 'comment');

  const watchlistClassName = cn(
    BUTTON_BASE_CLASS, buttonWatchlistClass, {[buttonActiveClass]: isInWatchlist}
  );

  const alreadyWatchedClassName = cn(
    BUTTON_BASE_CLASS, buttonWatchedClass, {[buttonActiveClass]: hasAlreadyWatched}
  );

  const favoriteClassName = cn(
    BUTTON_BASE_CLASS, buttonFavoriteClass, {[buttonActiveClass]: isFavorite}
  );

  return (
    `<article class="film-card"">
      <a class="film-card__link">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${releaseYear}</span>
          <span class="film-card__duration">${runtimeHumanized}</span>
          <span class="film-card__genre">${genresText}</span>
        </p>
        <img src="${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${descriptionShort}</p>
        <span class="film-card__comments">${commentsInfo}</span>
      </a>
      <div class="film-card__controls">
        <button class="${watchlistClassName}" type="button" ${isDisabled ? 'disabled' : ''}>Add to watchlist</button>
        <button class="${alreadyWatchedClassName}" type="button" ${isDisabled ? 'disabled' : ''}>Mark as watched</button>
        <button class="${favoriteClassName}" type="button" ${isDisabled ? 'disabled' : ''}>Mark as favorite</button>
      </div>
    </article>`
  );
};

export default class FilmItemView extends AbstractStatefulView {
  #film;
  #callbacksMap;

  constructor(film) {
    super();

    this.#film = {
      ...film,
      userDetails: {...film.userDetails},
    };

    this._state = {
      isDisabled: false,
    };
  }

  get template() {
    return createFilmItemTemplate(this.#film, this._state);
  }

  setHandlers = (callbacksMap) => {
    this.#callbacksMap = callbacksMap;
    this.#setWatchlistClickHandler(this.#callbacksMap[CallbackName.WATCHLIST_CLICK]);
    this.#setWatchedClickHandler(this.#callbacksMap[CallbackName.WATCHED_CLICK]);
    this.#setFavoriteClickHandler(this.#callbacksMap[CallbackName.FAVORITE_CLICK]);
  };

  removeHandlers = () => {
    this.element.removeEventListener('click', this.#clickHandler);

    this.element.querySelector(`.${buttonWatchlistClass}`)
      .removeEventListener('click', this.#watchlistClickHandler);

    this.element.querySelector(`.${buttonWatchedClass}`)
      .removeEventListener('click', this.#watchedClickHandler);

    this.element.querySelector(`.${buttonFavoriteClass}`)
      .removeEventListener('click', this.#favoriteClickHandler);
  };

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  _restoreHandlers = () => {
    this.setHandlers(this.#callbacksMap);
    this.setClickHandler(this._callback.click);
  };

  #setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;

    this.element.querySelector(`.${buttonWatchlistClass}`)
      .addEventListener('click', this.#watchlistClickHandler);
  };

  #setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;

    this.element.querySelector(`.${buttonWatchedClass}`)
      .addEventListener('click', this.#watchedClickHandler);
  };

  #setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;

    this.element.querySelector(`.${buttonFavoriteClass}`)
      .addEventListener('click', this.#favoriteClickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click(evt);
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}
