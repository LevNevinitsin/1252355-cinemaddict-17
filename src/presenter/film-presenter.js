import { render, replace, remove } from 'framework';
import { FilmItemView, PopupView } from 'view';

import {
  PopupCommentListView,
  PopupCommentItemView,
  PopupTopContainerView,
  PopupBottomContainerView,
  PopupNewCommentView,
} from 'popup';

const Mode = {
  DEFAULT: 'DEFAULT',
  OPENED: 'OPENED',
};

const BUTTON_TAG_NAME = 'BUTTON';
const BODY_HIDE_OVERFLOW_CLASS = 'hide-overflow';

export default class FilmPresenter {
  #container = null;
  #bodyElement = null;
  #siteFooterElement = null;

  #changeMode = null;
  #changeData = null;
  #mode = Mode.DEFAULT;

  #film = null;
  #filmComponent = null;

  #popupComponent = null;
  #popupCommentListComponent = null;
  #popupNewCommentComponent = null;
  #popupTopContainerComponent = null;
  #popupBottomContainerComponent = null;
  #filmComments = null;
  #commentModel = null;
  #filmModel = null;

  constructor(
    container, bodyElement, siteFooterElement, changeMode, changeData, filmModel, commentModel
  ) {
    this.#container = container;
    this.#bodyElement = bodyElement;
    this.#siteFooterElement = siteFooterElement;
    this.#changeMode = changeMode;
    this.#changeData = changeData;
    this.#filmModel = filmModel;
    this.#commentModel = commentModel;
  }

  init = (film) => {
    this.#film = film;
    const prevFilmComponent = this.#filmComponent;
    this.#filmComponent = new FilmItemView(film);

    this.#filmComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#filmComponent.setClickHandler((evt) => {
      if (evt.target.tagName !== BUTTON_TAG_NAME && this.#mode === Mode.DEFAULT) {
        this.#openPopup();
      }
    });

    if (prevFilmComponent === null) {
      render(this.#filmComponent, this.#container);
      return;
    }

    if (this.#container.contains(prevFilmComponent.element)) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    remove(prevFilmComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closePopup();
    }
  };

  isOpened = () => this.#mode === Mode.OPENED;

  #handleWatchlistClick = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;
    this.#changeData(this.#film);
  };

  #handleWatchedClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#changeData(this.#film);
  };

  #handleFavoriteClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#changeData(this.#film);
  };

  #openPopup = () => {
    this.#changeMode();
    this.#renderPopup();
    this.#bodyElement.classList.add(BODY_HIDE_OVERFLOW_CLASS);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.OPENED;
  };

  #closePopup = () => {
    remove(this.#popupComponent);
    this.#bodyElement.classList.remove(BODY_HIDE_OVERFLOW_CLASS);
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#closePopup();
    }
  };

  initPopupTopContainer = () => {
    const prevPopupTopContainerComponent = this.#popupTopContainerComponent;
    this.#popupTopContainerComponent = new PopupTopContainerView(this.#film);

    this.#popupTopContainerComponent.setClickHandler(this.#closePopup);
    this.#popupTopContainerComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#popupTopContainerComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#popupTopContainerComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (this.#mode === Mode.DEFAULT) {
      render(this.#popupTopContainerComponent, this.#popupComponent.element);
      return;
    }

    if (this.#popupComponent.element.contains(prevPopupTopContainerComponent.element)) {
      replace(this.#popupTopContainerComponent, prevPopupTopContainerComponent);
    }

    remove(prevPopupTopContainerComponent);
  };

  #renderPopup = () => {
    this.#popupComponent = new PopupView();
    this.#popupCommentListComponent = new PopupCommentListView();
    this.#popupNewCommentComponent = new PopupNewCommentView();
    this.initPopupTopContainer();

    this.#popupBottomContainerComponent = new PopupBottomContainerView(
      this.#film.commentsIds.length
    );

    this.#filmComments = this.#commentModel.getFilmComments(this.#film.id, this.#filmModel);

    this.#filmComments.forEach((comment) => {
      render(new PopupCommentItemView(comment), this.#popupCommentListComponent.element);
    });

    render(this.#popupCommentListComponent, this.#popupBottomContainerComponent.element);
    render(this.#popupNewCommentComponent, this.#popupBottomContainerComponent.element);
    render(this.#popupBottomContainerComponent, this.#popupComponent.element);
    render(this.#popupComponent, this.#siteFooterElement, 'afterend');
  };
}
