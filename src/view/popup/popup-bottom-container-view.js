import { createElement } from 'utils';

const createPopupBottomContainerTemplate = (commentsCount) => (
  `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>
    </section>
  </div>`
);

export default class PopupBottomContainerView {
  constructor(commentsCount) {
    this.commentsCount = commentsCount;
  }

  getTemplate() {
    return createPopupBottomContainerTemplate(this.commentsCount);
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
