import { createElement } from 'utils';

const createMainContentTemplate = () => '<section class="films"></section>';

export default class MainContentView {
  #element = null;

  get template() {
    return createMainContentTemplate();
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
