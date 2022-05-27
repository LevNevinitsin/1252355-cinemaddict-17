import { RenderPosition, render, replace, remove } from 'framework';
import { FilmItemView, PopupView } from 'view';
import { CommentModel } from 'model';
import { CallbackName, UserAction, UpdateType } from 'const';

import {
  PopupCommentListView,
  PopupCommentItemView,
  PopupTopContainerView,
  PopupBottomContainerView,
  PopupNewCommentView,
  PopupCommentsCountView,
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
  #callbacksMap = null;

  #popupComponent = null;
  #popupCommentListComponent = null;
  #popupNewCommentComponent = null;
  #popupTopContainerComponent = null;
  #popupBottomContainerComponent = null;
  #popupCommentsCountComponent;
  #commentModel = null;
  #filmModel = null;

  #commentComponent = new Map();

  constructor (
    container, bodyElement, siteFooterElement, changeMode, changeData, filmModel
  ) {
    this.#container = container;
    this.#bodyElement = bodyElement;
    this.#siteFooterElement = siteFooterElement;
    this.#changeMode = changeMode;
    this.#changeData = changeData;
    this.#filmModel = filmModel;

    this.#callbacksMap = {
      [CallbackName.CARD_CLICK]: (evt) => {
        if (evt.target.tagName !== BUTTON_TAG_NAME && this.#mode === Mode.DEFAULT) {
          this.#openPopup();
        }
      },

      [CallbackName.WATCHLIST_CLICK]: this.#handleWatchlistClick,
      [CallbackName.WATCHED_CLICK]: this.#handleWatchedClick,
      [CallbackName.FAVORITE_CLICK]: this.#handleFavoriteClick,
      [CallbackName.CLOSE_CLICK]: this.#closePopup,
    };
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

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closePopup();
    }
  };

  isOpened = () => this.#mode === Mode.OPENED;

  destroy = () => {
    remove(this.#filmComponent);
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#commentModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentModel.deleteComment(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.MINOR:
        this.#clearCommentsSection();
        this.#renderCommentsSection();
        break;
    }
  };

  #handleWatchlistClick = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.PATCH, this.#film);
  };

  #handleWatchedClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.PATCH, this.#film);
  };

  #handleFavoriteClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.PATCH, this.#film);
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
    this.#popupTopContainerComponent.setHandlers(this.#callbacksMap);

    if (this.#mode === Mode.DEFAULT) {
      render(this.#popupTopContainerComponent, this.#popupComponent.element);
      return;
    }

    if (this.#popupComponent.element.contains(prevPopupTopContainerComponent.element)) {
      replace(this.#popupTopContainerComponent, prevPopupTopContainerComponent);
    }

    prevPopupTopContainerComponent.removeHandlers();
    remove(prevPopupTopContainerComponent);
  };

  #clearCommentsSection = () => {
    remove(this.#popupCommentsCountComponent);
    remove(this.#popupCommentListComponent);
    remove(this.#popupNewCommentComponent);
  };

  #renderCommentsSection = () => {
    this.#popupCommentsCountComponent = new PopupCommentsCountView(
      this.#commentModel.comments.length
    );

    this.#popupCommentListComponent = new PopupCommentListView();

    this.#commentModel.comments.forEach((comment) => {
      const popupCommentItemComponent = new PopupCommentItemView(comment);
      this.#commentComponent.set(comment.id, popupCommentItemComponent);
      popupCommentItemComponent.setDeleteClickHandler(this.#handleViewAction);
      render(popupCommentItemComponent, this.#popupCommentListComponent.element);
    });

    this.#popupNewCommentComponent = new PopupNewCommentView();

    render(
      this.#popupCommentsCountComponent,
      this.#popupBottomContainerComponent.element,
      RenderPosition.AFTERBEGIN
    );

    render(
      this.#popupCommentListComponent,
      this.#popupCommentsCountComponent.element,
      RenderPosition.AFTEREND
    );

    render(this.#popupNewCommentComponent, this.#popupBottomContainerComponent.element);
  };

  #renderPopup = () => {
    this.#commentModel = new CommentModel(this.#film.id, this.#filmModel);
    this.#commentModel.addObserver(this.#handleModelEvent);
    this.#popupComponent = new PopupView();
    this.initPopupTopContainer();
    this.#popupBottomContainerComponent = new PopupBottomContainerView();

    this.#renderCommentsSection();
    render(this.#popupBottomContainerComponent, this.#popupComponent.element);
    render(this.#popupComponent, this.#siteFooterElement, RenderPosition.AFTEREND);

    this.#popupNewCommentComponent.setCtrlEnterKeydownHandler(this.#handleViewAction);
  };
}
