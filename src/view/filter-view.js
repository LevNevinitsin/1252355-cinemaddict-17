import { AbstractView } from 'frameworkView';
import { FilterType } from 'const';

const ACTIVE_CLASS = 'main-navigation__item--active';

const filtersNamesMap = {
  [FilterType.ALL]: 'All movies',
  [FilterType.WATCHLIST]: 'Watchlist',
  [FilterType.HISTORY]: 'History',
  [FilterType.FAVORITES]: 'Favorites',
};

const createFilterTemplate = (filter) => {
  const filterName = filter.name;
  let countElement = `<span class="main-navigation__item-count">${filter.count}</span>`;
  let activeClass = '';

  if (filterName === FilterType.ALL) {
    countElement = '';
    activeClass = ACTIVE_CLASS;
  }

  return (
    `<a href="#${filter.name}" class="main-navigation__item ${activeClass}">
      ${filtersNamesMap[filterName]} ${countElement}
    </a>`
  );
};

const createFiltersTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterTemplate(filter))
    .join('');

  return `<nav class="main-navigation">${filterItemsTemplate}</nav>`;
};

export default class FilterView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFiltersTemplate(this.#filters);
  }
}
