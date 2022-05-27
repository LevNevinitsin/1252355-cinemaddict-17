import { AbstractView } from 'frameworkView';
import { SortType } from 'const';

const ANCHOR_TAG = 'A';

const createSortTemplate = (currentSortType) => (
  `<ul class="sort">
    <li><a href="#" class="sort__button ${currentSortType === SortType.DEFAULT ? 'sort__button--active' : ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.DATE_DESC ? 'sort__button--active' : ''}" data-sort-type="${SortType.DATE_DESC}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.RATING_DESC ? 'sort__button--active' : ''}" data-sort-type="${SortType.RATING_DESC}">Sort by rating</a></li>
  </ul>`
);

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
