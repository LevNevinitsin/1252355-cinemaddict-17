import { createElement } from 'utils';

const createNoFilmsTemplate = () => '<h2 class="films-list__title">There are no movies in our database</h2>';

export default class NoFilmsView {
  #element = null;

  get template() {
    return createNoFilmsTemplate();
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
