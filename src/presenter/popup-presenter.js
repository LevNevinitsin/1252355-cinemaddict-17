import { RenderPosition, render, replace, remove } from 'framework';
import { CommentModel } from 'model';
import { PopupView } from 'view';
import { CallbackName, UserAction, UpdateType, AUTHORIZATION, END_POINT } from 'const';
import { CommentsApiService } from 'api';

import {
  PopupFormView,
  PopupCommentListView,
  PopupCommentItemView,
  PopupTopContainerView,
  PopupBottomContainerView,
  PopupNewCommentView,
  PopupCommentsCountView,
  PopupLoadingView,
} from 'popup';

const BODY_HIDE_OVERFLOW_CLASS = 'hide-overflow';
const CONTROLS_SELECTOR = '.film-details__controls';

const Mode = {
  DEFAULT: 'DEFAULT',
  OPENED: 'OPENED',
};

export default class PopupPresenter {
  #container = null;
  #bodyElement = null;
  #film = null;
  #callbacksMap = null;
  #changeData = null;

  #popupComponent = null;
  #popupFormComponent = null;
  #popupCommentListComponent = null;
  #popupNewCommentComponent = null;
  #popupTopContainerComponent = null;
  #popupBottomContainerComponent = null;
  #popupCommentsCountComponent;
  #popupLoadingComponent = new PopupLoadingView();
  #commentModel = null;

  #mode = Mode.DEFAULT;
  #commentComponent = new Map();
  #isLoading = true;
  #uiBlocker = null;
  #filmModel = null;

  constructor(container, bodyElement, changeData, uiBlocker, filmModel) {
    this.#container = container;
    this.#bodyElement = bodyElement;
    this.#changeData = changeData;
    this.#uiBlocker = uiBlocker;
    this.#filmModel = filmModel;
    this.#commentModel = new CommentModel(new CommentsApiService(END_POINT, AUTHORIZATION));
    this.#commentModel.addObserver(this.#handleModelEvent);

    this.#callbacksMap = {
      [CallbackName.CTRL_ENTER_KEYDOWN]: this.#handleViewAction,
      [CallbackName.WATCHLIST_CLICK]: this.#handleWatchlistClick,
      [CallbackName.WATCHED_CLICK]: this.#handleWatchedClick,
      [CallbackName.FAVORITE_CLICK]: this.#handleFavoriteClick,
      [CallbackName.CLOSE_CLICK]: this.#closePopup,
    };
  }

  get popupTopContainerComponent() {
    return this.#popupTopContainerComponent;
  }

  get film() {
    return this.#film;
  }

  set film(film) {
    this.#film = film;
  }

  get filmId() {
    return this.#film.id;
  }

  init = (film) => {
    this.#film = film;
    this.#commentModel.loadComments(this.#film.id);
    const prevPopupComponent = this.#popupComponent;

    this.#popupNewCommentComponent?.removeHandlers();
    this.#isLoading = true;
    this.#renderPopup();
    this.#mode = Mode.OPENED;

    if (prevPopupComponent === null) {
      render(this.#popupComponent, this.#container, RenderPosition.AFTEREND);
      this.#bodyElement.classList.add(BODY_HIDE_OVERFLOW_CLASS);
      document.addEventListener('keydown', this.#onEscKeyDown);
      return;
    }

    replace(this.#popupComponent, prevPopupComponent);
    remove(prevPopupComponent);
  };

  isOpened = () => this.#mode === Mode.OPENED;

  setFilmInfoSaving = () => {
    this.#popupTopContainerComponent.updateElement({
      isDisabled: true,
    });
  };

  refreshPopupTopContainer = () => {
    this.#clearPopupTopContainer();
    this.#renderPopupTopContainer();
  };

  #setCommentDeleting = (commentId) => {
    this.#commentComponent.get(commentId).updateElement({
      isDisabled: true,
    });
  };

  #setCommentPosting = () => {
    this.#popupNewCommentComponent.updateElement({
      isDisabled: true,
    });
  };

  setFilmInfoAborting = (callback) => {
    this.#popupTopContainerComponent.shake(callback, CONTROLS_SELECTOR);
  };

  #setDeleteCommentAborting = (commentId) => {
    this.#commentComponent.get(commentId).shake(this.#resetCommentState(commentId));
  };

  #resetCommentState = (commentId) => (
    () => {
      this.#commentComponent.get(commentId).updateElement({
        isDisabled: false,
      });
    }
  );

  #setAddCommentAborting = () => {
    this.#popupNewCommentComponent.shake(this.#resetFormState);
  };

  #resetFormState = () => {
    this.#popupNewCommentComponent.updateElement({
      isDisabled: false,
    });
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.DELETE_COMMENT:
        this.#setCommentDeleting(update.id);

        try {
          await this.#commentModel.deleteComment(updateType, update);
        } catch(err) {
          this.#setDeleteCommentAborting(update.id);
        }

        break;
      case UserAction.ADD_COMMENT:
        this.#setCommentPosting(update.id);

        try {
          await this.#commentModel.addComment(updateType, update, this.filmId);
        } catch(err) {
          this.#setAddCommentAborting();
        }

        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.POPUP_MINOR:
        this.#refreshCommentsSection();
        this.#filmModel.setFilmCommentsIds(this.#film.id, this.#commentModel.commentsIds);
        break;
      case UpdateType.POPUP_MAJOR:
        this.#refreshCommentsSection();
        this.#clearNewCommentSection();
        this.#renderNewCommentSection();
        this.#filmModel.setFilmCommentsIds(this.#film.id, this.#commentModel.commentsIds);
        break;
      case  UpdateType.POPUP_INIT:
        this.#isLoading = false;
        remove(this.#popupLoadingComponent);
        this.#renderCommentsSection();
        break;
    }
  };

  #closePopup = () => {
    remove(this.#popupComponent);
    this.#popupComponent = null;
    this.#bodyElement.classList.remove(BODY_HIDE_OVERFLOW_CLASS);
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
    this.#film = null;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#closePopup();
    }
  };

  #renderLoading = () => {
    render(this.#popupLoadingComponent, this.#popupBottomContainerComponent.element);
  };

  #renderPopupTopContainer = () => {
    this.#popupTopContainerComponent = new PopupTopContainerView(this.#film);
    this.#popupTopContainerComponent.setHandlers(this.#callbacksMap);

    render(
      this.#popupTopContainerComponent,
      this.#popupFormComponent.element,
      RenderPosition.AFTEREND
    );
  };

  #clearPopupTopContainer = () => {
    this.#popupTopContainerComponent.removeHandlers();
    remove(this.#popupTopContainerComponent);
  };

  #renderCommentsSection = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

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
  };

  #clearCommentsSection = () => {
    remove(this.#popupCommentsCountComponent);
    remove(this.#popupCommentListComponent);
  };

  #refreshCommentsSection = () => {
    this.#clearCommentsSection();
    this.#renderCommentsSection();
  };

  #renderNewCommentSection = () => {
    this.#popupNewCommentComponent = new PopupNewCommentView();
    render(this.#popupNewCommentComponent, this.#popupBottomContainerComponent.element);
    this.#popupNewCommentComponent.setHandlers(this.#callbacksMap);
  };

  #clearNewCommentSection = () => {
    remove(this.#popupNewCommentComponent);
    this.#popupNewCommentComponent.removeHandlers();
  };

  #renderPopup = () => {
    this.#popupComponent = new PopupView();
    this.#popupFormComponent = new PopupFormView();
    render(this.#popupFormComponent, this.#popupComponent.element);
    this.#renderPopupTopContainer();
    this.#popupBottomContainerComponent = new PopupBottomContainerView();
    this.#renderCommentsSection();
    this.#renderNewCommentSection();
    render(this.#popupBottomContainerComponent, this.#popupComponent.element);
  };

  #handleWatchlistClick = () => {
    const updatedFilm = {
      ...this.#film,

      userDetails: {
        ...this.#film.userDetails,
        watchlist: !this.#film.userDetails.watchlist,
      },
    };

    this.#changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, updatedFilm, this);
  };

  #handleWatchedClick = () => {
    const updatedFilm = {
      ...this.#film,

      userDetails: {
        ...this.#film.userDetails,
        alreadyWatched: !this.#film.userDetails.alreadyWatched,
      },
    };

    this.#changeData(UserAction.UPDATE_FILM, UpdateType.SUPERMINOR, updatedFilm, this);
  };

  #handleFavoriteClick = () => {
    const updatedFilm = {
      ...this.#film,

      userDetails: {
        ...this.#film.userDetails,
        favorite: !this.#film.userDetails.favorite,
      },
    };

    this.#changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, updatedFilm, this);
  };
}
