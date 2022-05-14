import { AbstractView } from 'frameworkView';
import { formatRating, getYear, getHumanizedDuration, truncate, pluralize } from 'utils';
import cn from 'classnames';

const MAX_DESCRIPTION_LENGTH = 140;
const GENRE_DEFAULT_NUMBER = 0;
const BUTTON_BASE_CLASS = 'film-card__controls-item';

const Modifier = {
  WATCHLIST: 'add-to-watchlist',
  WATCHED: 'mark-as-watched',
  FAVORITE: 'favorite',
  ACTIVE: 'active',
};

const buttonWatchlistClass = `${BUTTON_BASE_CLASS}--${Modifier.WATCHLIST}`;
const buttonAlreadyWatchedClass = `${BUTTON_BASE_CLASS}--${Modifier.WATCHED}`;
const buttonFavoriteClass = `${BUTTON_BASE_CLASS}--${Modifier.FAVORITE}`;
const buttonActiveClass = `${BUTTON_BASE_CLASS}--${Modifier.ACTIVE}`;

const watchlistButtonSelector = `.${buttonWatchlistClass}`;
const watchedButtonSelector = `.${buttonAlreadyWatchedClass}`;
const favoriteButtonSelector = `.${buttonFavoriteClass}`;

const createFilmItemTemplate = (film) => {
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
    BUTTON_BASE_CLASS, buttonAlreadyWatchedClass, {[buttonActiveClass]: hasAlreadyWatched}
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
        <button class="${watchlistClassName}" type="button">Add to watchlist</button>
        <button class="${alreadyWatchedClassName}" type="button">Mark as watched</button>
        <button class="${favoriteClassName}" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};

export default class FilmItemView extends AbstractView {
  #film;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmItemTemplate(this.#film);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;

    this.element.querySelector(watchlistButtonSelector)
      .addEventListener('click', this.#watchlistClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;

    this.element.querySelector(watchedButtonSelector)
      .addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;

    this.element.querySelector(favoriteButtonSelector)
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
