import { createElement } from 'utils';

const createPopupCommentItemTemplate = () => (
  `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/smile.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">Interesting setting and a good cast</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">Tim Macoveev</span>
        <span class="film-details__comment-day">2019/12/31 23:59</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`
);

export default class PopupCommentItemView {
  getTemplate() {
    return createPopupCommentItemTemplate();
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
