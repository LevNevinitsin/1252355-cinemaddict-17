import { AbstractView } from 'frameworkView';

const createPopupCommentsCountTemplate = (commentsCount) => (
  `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>`
);

export default class PopupCommentsCountView extends AbstractView {
  #commentsCount;

  constructor(commentsCount) {
    super();
    this.#commentsCount = commentsCount;
  }

  get template() {
    return createPopupCommentsCountTemplate(this.#commentsCount);
  }
}
