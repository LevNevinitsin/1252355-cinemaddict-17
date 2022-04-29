import { createElement } from 'utils';

const createPopupCommentListTemplate = () => '<ul class="film-details__comments-list"></ul>';

export default class PopupCommentListView {
  getTemplate() {
    return createPopupCommentListTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
