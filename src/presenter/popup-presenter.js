import { PopupView } from 'view';
import {
  PopupCommentListView,
  PopupCommentItemView,
  PopupTopContainerView,
  PopupBottomContainerView,
  PopupNewCommentView,
} from 'popup';

import { render } from 'utils';

export default class PopupPresenter {
  popupComponent = new PopupView();
  popupCommentListComponent = new PopupCommentListView();
  popupNewCommentComponent = new PopupNewCommentView();

  init = (siteFooterElement, filmModel, commentModel) => {
    const filmId = 1;
    this.siteFooterElement = siteFooterElement;
    this.filmModel = filmModel;
    this.film = filmModel.getFilm(filmId);
    this.popupTopContainerComponent = new PopupTopContainerView(this.film);
    render(this.popupTopContainerComponent, this.popupComponent.getElement());
    const filmCommentsIds = this.film.commentsIds;
    this.popupBottomContainerComponent = new PopupBottomContainerView(filmCommentsIds.length);
    this.commentModel = commentModel;
    this.filmComments = this.commentModel.getFilmComments(filmCommentsIds);

    this.filmComments.forEach((comment) => {
      render(new PopupCommentItemView(comment), this.popupCommentListComponent.getElement());
    });

    render(this.popupCommentListComponent, this.popupBottomContainerComponent.getElement());
    render(this.popupNewCommentComponent, this.popupBottomContainerComponent.getElement());
    render(this.popupBottomContainerComponent, this.popupComponent.getElement());
    render(this.popupComponent, this.siteFooterElement, 'afterend');
  };
}
