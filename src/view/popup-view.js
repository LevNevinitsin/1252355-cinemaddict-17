import { createElement } from 'utils';

const createPopupTemplate = () => (
  `<section class="film-details">
    <form class="film-details__inner" action="" method="get">

    </form>
  </section>`
);

export default class PopupView {
  getTemplate() {
    return createPopupTemplate();
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
