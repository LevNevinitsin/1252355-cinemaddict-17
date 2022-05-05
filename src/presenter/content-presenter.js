import {
  FilterView,
  SortView,
  MainContentView,
  FilmListView,
  ShowMoreButtonView,
  PopupView
} from 'view';

import {
  PopupCommentListView,
  PopupCommentItemView,
  PopupTopContainerView,
  PopupBottomContainerView,
  PopupNewCommentView,
} from 'popup';

import { render } from 'utils';

const FILMS_COUNT = 5;
const RATING_COUNT = 2;
const BUTTON_TAG_NAME = 'BUTTON';

const RatingDescription = {
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

const filmCardSelector = '.film-card';
const popupCloseSelector = '.film-details__close-btn';
const bodyHideOverflowClass = 'hide-overflow';

export default class ContentPresenter {
  #bodyElement;
  #siteMainElement;
  #siteFooterElement;
  #filmModel;
  #commentModel;
  #films;
  #filmsListComponent;
  #mainContentComponent = new MainContentView();
  #filmsCardsElements;

  #popupFilm;
  #popupComponent;
  #popupCommentListComponent;
  #popupNewCommentComponent;
  #popupTopContainerComponent;
  #popupBottomContainerComponent;
  #filmComments;

  init = (bodyElement, siteMainElement, siteFooterElement, filmModel, commentModel) => {
    this.#bodyElement = bodyElement;
    this.#siteMainElement = siteMainElement;
    this.#siteFooterElement = siteFooterElement;
    this.#filmModel = filmModel;
    this.#commentModel = commentModel;
    this.#films = [...this.#filmModel.films];
    render(new FilterView(), this.#siteMainElement);
    render(new SortView(), this.#siteMainElement);
    this.#filmsListComponent = new FilmListView(this.#films, FILMS_COUNT);
    render(this.#filmsListComponent, this.#mainContentComponent.element);
    render(new ShowMoreButtonView(), this.#filmsListComponent.element);

    render(
      new FilmListView(this.#filmModel.topRatingFilms, RATING_COUNT, RatingDescription.TOP_RATED),
      this.#mainContentComponent.element
    );

    render(
      new FilmListView(
        this.#filmModel.mostCommentedFilms,
        RATING_COUNT,
        RatingDescription.MOST_COMMENTED
      ),

      this.#mainContentComponent.element
    );

    render(this.#mainContentComponent, this.#siteMainElement);

    this.#filmsCardsElements = this.#mainContentComponent.element
      .querySelectorAll(filmCardSelector);

    this.#filmsCardsElements.forEach((filmCardElement) => {
      filmCardElement.addEventListener('click', (evt) => {
        if (evt.target.tagName !== BUTTON_TAG_NAME) {
          this.#openPopup(filmCardElement.dataset.id);
        }
      });
    });
  };

  #openPopup = (filmId) => {
    this.#renderPopup(filmId);
    this.#bodyElement.classList.add(bodyHideOverflowClass);
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #closePopup = () => {
    this.#popupComponent.element.remove();
    this.#popupComponent.removeElement();
    this.#bodyElement.classList.remove(bodyHideOverflowClass);
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

    this.#popupTopContainerComponent.element.querySelector(popupCloseSelector).addEventListener(
      'click', () => {
        this.#closePopup();
      }
    );
  };
}


