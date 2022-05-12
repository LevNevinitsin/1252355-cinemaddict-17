import { AbstractView } from 'frameworkView';

const createPopupBottomContainerTemplate = (commentsCount) => (
  `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>
    </section>
  </div>`
);

export default class PopupBottomContainerView extends AbstractView {
  #commentsCount;

  constructor(commentsCount) {
    super();
    this.#commentsCount = commentsCount;
  }

  get template() {
    return createPopupBottomContainerTemplate(this.#commentsCount);
  }
}
