import { AbstractView } from 'frameworkView';
import { formatRating, formatDate, getHumanizedDuration } from 'utils';
import { CallbackName } from 'const';
import cn from 'classnames';

const RELEASE_DATE_FORMAT = 'D MMMM YYYY';
const POPUP_CLOSE_SELECTOR = '.film-details__close-btn';

const BUTTON_BASE_CLASS = 'film-details__control-button';
const buttonWatchlistClass = `${BUTTON_BASE_CLASS}--watchlist`;
const buttonWatchedClass = `${BUTTON_BASE_CLASS}--watched`;
const buttonFavoriteClass = `${BUTTON_BASE_CLASS}--favorite`;
const buttonActiveClass = `${BUTTON_BASE_CLASS}--active`;

const createGenresTemplate = (genres) => (
  genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('')
);

const createPopupTopContainerTemplate = (film) => {
  const {
    title,
    alternativeTitle,
    totalRating,
    poster,
    ageRating,
    director,
    writers,
    actors,
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
  const writersInfo = writers.join(', ');
  const actorsInfo = actors.join(', ');
  const releaseDate = formatDate(release.date, RELEASE_DATE_FORMAT);
  const runtimeHumanized = getHumanizedDuration(runtime);
  const country = release.releaseCountry;
  const genresCaption = genres.length === 1 ? 'Genre' : 'Genres';
  const genresTemplate = createGenresTemplate(genres);

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
    `<div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writersInfo}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actorsInfo}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${releaseDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${runtimeHumanized}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genresCaption}</td>
              <td class="film-details__cell">${genresTemplate}</td>
            </tr>
          </table>

          <p class="film-details__film-description">${description}</p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="${watchlistClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="${alreadyWatchedClassName}" id="watched" name="watched">Already watched</button>
        <button type="button" class="${favoriteClassName}" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>`
  );
};

export default class PopupTopContainerView extends AbstractView {
  #film;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createPopupTopContainerTemplate(this.#film);
  }

  setHandlers = (callbacksMap) => {
    this.#setCloseClickHandler(callbacksMap[CallbackName.CLOSE_CLICK]);
    this.#setWatchlistClickHandler(callbacksMap[CallbackName.WATCHLIST_CLICK]);
    this.#setWatchedClickHandler(callbacksMap[CallbackName.WATCHED_CLICK]);
    this.#setFavoriteClickHandler(callbacksMap[CallbackName.FAVORITE_CLICK]);
  };

  removeHandlers = () => {
    this.element.querySelector(POPUP_CLOSE_SELECTOR)
      .removeEventListener('click', this.#closeClickHandler);

    this.element.querySelector(`.${buttonWatchlistClass}`)
      .removeEventListener('click', this.#watchlistClickHandler);

    this.element.querySelector(`.${buttonWatchedClass}`)
      .removeEventListener('click', this.#watchedClickHandler);

    this.element.querySelector(`.${buttonFavoriteClass}`)
      .removeEventListener('click', this.#favoriteClickHandler);
  };

  #setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;

    this.element.querySelector(POPUP_CLOSE_SELECTOR)
      .addEventListener('click', this.#closeClickHandler);
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

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
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
