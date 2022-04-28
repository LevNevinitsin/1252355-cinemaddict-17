import {createElement} from '../render.js';

const createFilmsExtraTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Most commented</h2>

  </section>`
);

export default class FilmsExtraView {
  getTemplate() {
    return createFilmsExtraTemplate();
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
