import {createElement} from '../render.js';

const createMainContentTemplate = () => '<section class="films"></section>';

export default class MainContentView {
  getTemplate() {
    return createMainContentTemplate();
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
