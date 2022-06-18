import he from 'he';
import { AbstractStatefulView } from 'frameworkView';
import { getRelativeTime } from 'utils';
import { UserAction, UpdateType } from 'const';

const DELETE_BUTTON_SELECTOR = '.film-details__comment-delete';

const DeleteButtonText = {
  DELETE: 'Delete',
  DELETING: 'Deleting...',
};

const createPopupCommentItemTemplate = (comment, { isDisabled }) => {
  const {
    author,
    comment: commentText,
    date,
    emotion,
  } = comment;

  const relativeTime = getRelativeTime(date);
  const deleteButtonText = isDisabled ? DeleteButtonText.DELETING : DeleteButtonText.DELETE;

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(commentText)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${relativeTime}</span>
          <button class="film-details__comment-delete" ${isDisabled ? 'disabled' : ''}>${deleteButtonText}</button>
        </p>
      </div>
    </li>`
  );
};

export default class PopupCommentItemView extends AbstractStatefulView {
  #comment;

  constructor(comment) {
    super();
    this.#comment = comment;

    this._state = {
      isDisabled: false,
    };
  }

  get template() {
    return createPopupCommentItemTemplate(this.#comment, this._state);
  }

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;

    this.element
      .querySelector(DELETE_BUTTON_SELECTOR)
      .addEventListener('click', this.#deleteClickHandler);
  };

  _restoreHandlers = () => {
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(UserAction.DELETE_COMMENT, UpdateType.POPUP_MINOR, this.#comment);
  };
}
