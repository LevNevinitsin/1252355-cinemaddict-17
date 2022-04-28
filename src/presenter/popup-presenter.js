import PopupView                from '../view/popup/popup-view.js';
import PopupCommentListView     from '../view/popup/popup-comment-list-view.js';
import PopupCommentItemView     from '../view/popup/popup-comment-item-view.js';
import PopupTopContainerView    from '../view/popup/popup-top-container-view.js';
import PopupBottomContainerView from '../view/popup/popup-bottom-container-view.js';
import PopupNewCommentView      from '../view/popup/popup-new-comment-view.js';
import {render}                 from '../render.js';

export default class PopupPresenter {
  popupComponent                = new PopupView();
  popupTopContainerComponent    = new PopupTopContainerView();
  popupBottomContainerComponent = new PopupBottomContainerView();
  popupCommentListComponent     = new PopupCommentListView();
  popupNewCommentComponent      = new PopupNewCommentView();

  init = (siteFooterElement) => {
    this.siteFooterElement = siteFooterElement;
    render(this.popupTopContainerComponent, this.popupComponent.getElement());

    for (let i = 0; i < 4; i++) {
      render(new PopupCommentItemView(), this.popupCommentListComponent.getElement());
    }

    render(this.popupCommentListComponent, this.popupBottomContainerComponent.getElement());
    render(this.popupNewCommentComponent, this.popupBottomContainerComponent.getElement());
    render(this.popupBottomContainerComponent, this.popupComponent.getElement());

    render(this.popupComponent, this.siteFooterElement, 'afterend');
  };
}
