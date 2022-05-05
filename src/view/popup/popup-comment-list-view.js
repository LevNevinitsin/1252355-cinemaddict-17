import { createElement } from 'utils';

const createPopupCommentListTemplate = () => '<ul class="film-details__comments-list"></ul>';

export default class PopupCommentListView {
  #element = null;

  get template() {
    return createPopupCommentListTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
