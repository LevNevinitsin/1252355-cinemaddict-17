import { AbstractView } from 'frameworkView';

const createPopupBottomContainerTemplate = () => (
  `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap"></section>
  </div>`
);

export default class PopupBottomContainerView extends AbstractView {
  #commentsCount;

  constructor() {
    super();
  }

  get template() {
    return createPopupBottomContainerTemplate(this.#commentsCount);
  }
}
