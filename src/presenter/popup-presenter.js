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
  popupTopContainerComponent = new PopupTopContainerView();
  popupBottomContainerComponent = new PopupBottomContainerView();
  popupCommentListComponent = new PopupCommentListView();
  popupNewCommentComponent = new PopupNewCommentView();

  init = (siteFooterElement) => {
    const commentsCount = 4;
    this.siteFooterElement = siteFooterElement;
    render(this.popupTopContainerComponent, this.popupComponent.getElement());

    for (let i = 0; i < commentsCount; i++) {
      render(new PopupCommentItemView(), this.popupCommentListComponent.getElement());
    }

    render(this.popupCommentListComponent, this.popupBottomContainerComponent.getElement());
    render(this.popupNewCommentComponent, this.popupBottomContainerComponent.getElement());
    render(this.popupBottomContainerComponent, this.popupComponent.getElement());

    render(this.popupComponent, this.siteFooterElement, 'afterend');
  };
}
