import {
  FilterView,
  SortView,
  MainContentView,
  FilmListView,
  FilmsContainerView,
  FilmItemView,
  ShowMoreButtonView,
  NoFilmsView,
  PopupView
} from 'view';

import {
  PopupCommentListView,
  PopupCommentItemView,
  PopupTopContainerView,
  PopupBottomContainerView,
  PopupNewCommentView,
} from 'popup';

import { render, remove } from 'framework';

const FILMS_COUNT = 5;
const RATING_COUNT = 2;
const BUTTON_TAG_NAME = 'BUTTON';

const RatingDescription = {
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

const filmsListRerenderPosition = 'afterbegin';
const bodyHideOverflowClass = 'hide-overflow';

export default class ContentPresenter {
  #bodyElement;
  #siteMainElement;
  #siteFooterElement;
  #filmModel;
  #commentModel;
  #films;
  #filmsListComponent = new FilmListView();
  #filmsContainerComponent;
  #showMoreButtonComponent;
  #renderedFilmsCount;
  #mainContentComponent = new MainContentView();

  #popupFilm;
  #popupComponent;
  #popupCommentListComponent;
  #popupNewCommentComponent;
  #popupTopContainerComponent;
  #popupBottomContainerComponent;
  #filmComments;
  #isPopupOpened = false;

  init = (bodyElement, siteMainElement, siteFooterElement, filmModel, commentModel) => {
    this.#bodyElement = bodyElement;
    this.#siteMainElement = siteMainElement;
    this.#siteFooterElement = siteFooterElement;
    this.#filmModel = filmModel;
    this.#commentModel = commentModel;
    this.#films = [...this.#filmModel.films];

    render(new FilterView(), this.#siteMainElement);
    render(new SortView(), this.#siteMainElement);

    if (!this.#films.length) {
      render(new NoFilmsView(), this.#filmsListComponent.element);
      render(this.#filmsListComponent, this.#mainContentComponent.element);
    } else {
      this.#renderFilmsList(this.#films, FILMS_COUNT);

      if (this.#films.length > FILMS_COUNT) {
        this.#showMoreButtonComponent = new ShowMoreButtonView();
        render(this.#showMoreButtonComponent, this.#filmsListComponent.element);

        this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
      }

      this.#renderFilmsList(
        this.#filmModel.topRatingFilms, RATING_COUNT, RatingDescription.TOP_RATED
      );

      this.#renderFilmsList(
        this.#filmModel.mostCommentedFilms, RATING_COUNT, RatingDescription.MOST_COMMENTED
      );
    }

    render(this.#mainContentComponent, this.#siteMainElement);
  };

  #renderFilmsList = (films, filmsCount, listTitle = null) => {
    const filmsListComponent = !listTitle ? this.#filmsListComponent : new FilmListView(listTitle);
    const filmsContainerComponent = new FilmsContainerView();
    filmsCount = Math.min(films.length, filmsCount);

    if (!listTitle) {
      this.#filmsContainerComponent = filmsContainerComponent;
      this.#renderedFilmsCount = filmsCount;
    }

    for (let i = 0; i < filmsCount; i++) {
      this.#renderFilm(films[i], filmsContainerComponent.element);
    }

    render(filmsContainerComponent, filmsListComponent.element);
    render(filmsListComponent, this.#mainContentComponent.element);
  };

  #handleShowMoreButtonClick = () => {
    this.#filmsListComponent.element.remove();

    this.#films
      .slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_COUNT)
      .forEach((film) => { this.#renderFilm(film, this.#filmsContainerComponent.element); });

    render(this.#filmsListComponent, this.#mainContentComponent.element, filmsListRerenderPosition);
    this.#renderedFilmsCount += FILMS_COUNT;

    if (this.#renderedFilmsCount >= this.#films.length) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #renderFilm = (film, container) => {
    const filmComponent = new FilmItemView(film);

    filmComponent.setClickHandler((evt) => {
      if (evt.target.tagName !== BUTTON_TAG_NAME && !this.#isPopupOpened) {
        this.#openPopup(film.id);
        this.#isPopupOpened = true;
      }
    });

    render(filmComponent, container);
  };

  #openPopup = (filmId) => {
    this.#renderPopup(filmId);
    this.#bodyElement.classList.add(bodyHideOverflowClass);
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #closePopup = () => {
    remove(this.#popupComponent);
    this.#bodyElement.classList.remove(bodyHideOverflowClass);
    this.#isPopupOpened = false;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#closePopup();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #renderPopup = (popupFilmId) => {
    this.#popupFilm = this.#filmModel.getFilm(popupFilmId);
    this.#popupComponent = new PopupView();
    this.#popupCommentListComponent = new PopupCommentListView();
    this.#popupNewCommentComponent = new PopupNewCommentView();
    this.#popupTopContainerComponent = new PopupTopContainerView(this.#popupFilm);
    render(this.#popupTopContainerComponent, this.#popupComponent.element);

    this.#popupBottomContainerComponent = new PopupBottomContainerView(
      this.#popupFilm.commentsIds.length
    );

    this.#filmComments = this.#commentModel.getFilmComments(popupFilmId, this.#filmModel);

    this.#filmComments.forEach((comment) => {
      render(new PopupCommentItemView(comment), this.#popupCommentListComponent.element);
    });

    render(this.#popupCommentListComponent, this.#popupBottomContainerComponent.element);
    render(this.#popupNewCommentComponent, this.#popupBottomContainerComponent.element);
    render(this.#popupBottomContainerComponent, this.#popupComponent.element);
    render(this.#popupComponent, this.#siteFooterElement, 'afterend');

    this.#popupTopContainerComponent.setClickHandler(this.#closePopup);
  };
}


