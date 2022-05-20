import { AbstractStatefulView } from 'frameworkView';

const BLANK_COMMENT = {
  comment: '',
  emotion: null,
};

const Emotion = {
  SMILE: 'smile',
  SLEEPING: 'sleeping',
  PUKE: 'puke',
  ANGRY: 'angry',
};

const EMOJI_LIST_SELECTOR = '.film-details__emoji-list';
const TEXTAREA_SELECTOR = '.film-details__comment-input';
const IMAGE_TAG = 'IMG';

const createChosenEmotionTemplate = (chosenEmotion) => {
  if (!chosenEmotion) {
    return '<div class="film-details__add-emoji-label"></div>';
  }

  return (
    `<div class="film-details__add-emoji-label">
      <img src="images/emoji/${chosenEmotion}.png" width="55" height="55" alt="emoji-${chosenEmotion}">
    </div>`
  );
};

const createEmojiItems = (chosenEmotion) => (
  Object.values(Emotion).map((emotion) => {
    const checked = chosenEmotion === emotion ? 'checked' : '';

    return (
      `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}" ${checked}>
      <label class="film-details__emoji-label" for="emoji-${emotion}">
        <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
      </label>`
    );
  }).join('')
);

const createPopupNewCommentTemplate = (data) => {
  const chosenEmotion = data.emotion;

  return (
    `<div class="film-details__new-comment">
      ${createChosenEmotionTemplate(chosenEmotion)}

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${data.comment}</textarea>
      </label>

      <div class="film-details__emoji-list">
        ${createEmojiItems(chosenEmotion)}
      </div>
    </div>`
  );
};

export default class PopupNewCommentView extends AbstractStatefulView {
  constructor (comment = BLANK_COMMENT) {
    super();
    this._state = PopupNewCommentView.parseCommentToState(comment);
    this.#setInnerHandlers();
  }

  get template() {
    return createPopupNewCommentTemplate(this._state);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  #textInputHandler = (evt) => {
    evt.preventDefault();

    this._setState({
      comment: evt.target.value,
    });
  };

  #emojiClickHandler = (evt) => {
    evt.preventDefault();
    const evtTarget = evt.target;

    if (evtTarget.tagName === IMAGE_TAG) {
      const input = evtTarget.parentNode.previousElementSibling;

      this.updateElement({
        emotion: input.value,
      });
    }
  };

  #setInnerHandlers = () => {
    this.element.querySelector(EMOJI_LIST_SELECTOR)
      .addEventListener('click', this.#emojiClickHandler);

    this.element.querySelector(TEXTAREA_SELECTOR)
      .addEventListener('input', this.#textInputHandler);
  };

  static parseCommentToState = (comment) => ({...comment});
  static parseStateToComment = (state) => ({...state});
}
