import { AbstractView } from 'frameworkView';
import { FilterType } from 'const';
import cn from 'classnames';

const COUNT_CLASS = 'main-navigation__item-count';
const BASE_CLASS = 'main-navigation__item';
const ACTIVE_MODIFIER = 'active';
const activeClass = `${BASE_CLASS}--${ACTIVE_MODIFIER}`;

const createFilterTemplate = ([filterType, filterAttributes], currentFilterType) => {
  const {name, filter} = filterAttributes;
  const isCurrentFilter = filterType === currentFilterType;

  const countElement = !(name === FilterType.ALL)
    ? `<span class="main-navigation__item-count">${filter().length}</span>`
    : '';

  const filterClass = cn(BASE_CLASS, { [activeClass]: isCurrentFilter });

  return (
    `<a href="#${filterType}" class="${filterClass}" data-value="${filterType}">
      ${name} ${countElement}
    </a>`
  );
};

const createFiltersTemplate = (filtersMap, currentFilterType) => {
  const filterItemsTemplate = Object.entries(filtersMap)
    .map((filter) => createFilterTemplate(filter, currentFilterType))
    .join('');

  return `<nav class="main-navigation">${filterItemsTemplate}</nav>`;
};

export default class FilterView extends AbstractView {
  #filtersMap = null;
  #currentFilter = null;

  constructor(filtersMap, currentFilterType) {
    super();
    this.#filtersMap = filtersMap;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFiltersTemplate(this.#filtersMap, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    const targetClassList = evt.target.classList;

    if (targetClassList.contains(COUNT_CLASS)) {
      this._callback.filterTypeChange(evt.target.parentNode.dataset.value);
      return;
    }

    if (targetClassList.contains(BASE_CLASS)) {
      this._callback.filterTypeChange(evt.target.dataset.value);
    }
  };
}
