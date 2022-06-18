import { AbstractStatefulView } from 'frameworkView';
import { UserAction, UpdateType, CallbackName } from 'const';

const ENTER_KEY_VALUE = 'Enter';

const BLANK_COMMENT = {
  comment: '',
  emotion: null,
};

const emotions = ['smile', 'sleeping', 'puke', 'angry'];
const EMOJI_LIST_SELECTOR = '.film-details__emoji-list';
const TEXTAREA_SELECTOR = '.film-details__comment-input';

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

const createEmojiItems = (chosenEmotion, isDisabled) => (
  emotions.map((emotion) => {
    const checked = chosenEmotion === emotion ? 'checked' : '';

    return (
      `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}" ${checked} ${isDisabled ? 'disabled' : ''}>
      <label class="film-details__emoji-label" for="emoji-${emotion}">
        <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
      </label>`
    );
  }).join('')
);

const createPopupNewCommentTemplate = ({emotion, comment, isDisabled}) => (
  `<div class="film-details__new-comment">
    ${createChosenEmotionTemplate(emotion)}

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isDisabled ? 'disabled' : ''}>${comment}</textarea>
    </label>

    <div class="film-details__emoji-list">
      ${createEmojiItems(emotion, isDisabled)}
    </div>
  </div>`
);


export default class PopupNewCommentView extends AbstractStatefulView {
  #callbacksMap;

  constructor (comment = BLANK_COMMENT) {
    super();
    this._state = PopupNewCommentView.parseCommentToState(comment);
    this.#setInnerHandlers();
  }

  get template() {
    return createPopupNewCommentTemplate(this._state);
  }

  setHandlers = (callbacksMap) => {
    this.#callbacksMap = callbacksMap;
    this.#setCtrlEnterKeydownHandler(this.#callbacksMap[CallbackName.CTRL_ENTER_KEYDOWN]);
  };

  removeHandlers = () => {
    document.removeEventListener('keydown', this.#ctrlEnterKeydownHandler);
  };

  #setCtrlEnterKeydownHandler = (callback) => {
    this._callback.ctrlEnterKeydown = callback;
    document.addEventListener('keydown', this.#ctrlEnterKeydownHandler);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setHandlers(this.#callbacksMap);
  };

  #textInputHandler = (evt) => {
    evt.preventDefault();

    this._setState({
      comment: evt.target.value,
    });
  };

  #emojiChangeHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      emotion: evt.target.value,
    });
  };

  #setInnerHandlers = () => {
    this.element.querySelector(EMOJI_LIST_SELECTOR)
      .addEventListener('change', this.#emojiChangeHandler);

    this.element.querySelector(TEXTAREA_SELECTOR)
      .addEventListener('input', this.#textInputHandler);
  };

  #ctrlEnterKeydownHandler = (evt) => {
    if ((evt.ctrlKey || evt.metaKey) && evt.key === ENTER_KEY_VALUE) {
      evt.preventDefault();

      if (this._state.comment && this._state.emotion) {
        this._callback.ctrlEnterKeydown(UserAction.ADD_COMMENT, UpdateType.POPUP_MAJOR, this._state);
      }
    }
  };

  static parseCommentToState = (comment) => ({
    ...comment,
    isDisabled: false,
  });

  static parseStateToComment = (state) => {
    const comment = {...state};
    delete comment.isDisabled;

    return comment;
  };
}
