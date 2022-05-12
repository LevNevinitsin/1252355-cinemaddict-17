import { AbstractView } from 'frameworkView';
import { formatRating, getYear, getHumanizedDuration, truncate, pluralize } from 'utils';

const MAX_DESCRIPTION_LENGTH = 140;
const GENRE_DEFAULT_NUMBER = 0;

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

  const watchlistActiveClassName = isInWatchlist ? 'film-card__controls-item--active' : '';
  const alreadyWatchedActiveClassName = hasAlreadyWatched ? 'film-card__controls-item--active' : '';
  const favoriteActiveClassName = isFavorite ? 'film-card__controls-item--active' : '';

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
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlistActiveClassName}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${alreadyWatchedActiveClassName}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteActiveClassName}" type="button">Mark as favorite</button>
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
}
