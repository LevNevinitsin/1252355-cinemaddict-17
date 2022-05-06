import { createElement } from 'utils';

const createPopupBottomContainerTemplate = (commentsCount) => (
  `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>
    </section>
  </div>`
);

export default class PopupBottomContainerView {
  #element = null;

  constructor(commentsCount) {
    this.commentsCount = commentsCount;
  }

  get template() {
    return createPopupBottomContainerTemplate(this.commentsCount);
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
