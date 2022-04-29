import {createElement} from '../../render.js';

const createPopupBottomContainerTemplate = () => (
  `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">4</span></h3>
    </section>
  </div>`
);

export default class PopupBottomContainerView {
  getTemplate() {
    return createPopupBottomContainerTemplate();
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
