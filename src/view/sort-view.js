import { AbstractView } from 'frameworkView';
import { SortType } from 'const';
import cn from 'classnames';

const ANCHOR_TAG = 'A';
const SORT_BUTTON_BASE_CLASS = 'sort__button';
const SORT_BUTTON_ACTIVE_CLASS = 'sort__button--active';

const sortButtonsMap = {
  [SortType.DEFAULT]: 'Sort by default',
  [SortType.DATE_DESC]: 'Sort by date',
  [SortType.RATING_DESC]: 'Sort by rating',
};

const createSortButtonTemplate = (currentSortType, sortType, sortTitle) => {
  const className = cn(
    SORT_BUTTON_BASE_CLASS, { [SORT_BUTTON_ACTIVE_CLASS]: currentSortType === sortType }
  );

  return (
    `<li><a href="#" class="${className}" data-sort-type="${sortType}">${sortTitle}</a></li>`
  );
};

const createSortTemplate = (currentSortType) => {
  const sortButtonsTemplate = Object.entries(sortButtonsMap)
    .map(([sortType, sortTitle]) => createSortButtonTemplate(currentSortType, sortType, sortTitle))
    .join('');

  return `<ul class="sort">${sortButtonsTemplate}</ul>`;
};

export default class SortView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== ANCHOR_TAG) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
