import { AbstractView } from 'frameworkView';
import { formatRating, formatDate, getHumanizedDuration } from 'utils';

const RELEASE_DATE_FORMAT = 'D MMMM YYYY';

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

  const watchlistActiveClassName = isInWatchlist ? 'film-details__control-button--active' : '';
  const alreadyWatchedActiveClassName = hasAlreadyWatched ? 'film-details__control-button--active' : '';
  const favoriteActiveClassName = isFavorite ? 'film-details__control-button--active' : '';

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
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${watchlistActiveClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${alreadyWatchedActiveClassName}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${favoriteActiveClassName}" id="favorite" name="favorite">Add to favorites</button>
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
}
