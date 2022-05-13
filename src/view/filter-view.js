import { AbstractView } from 'frameworkView';
import { FilterType } from 'const';

const ACTIVE_CLASS = 'main-navigation__item--active';

const filtersNamesMap = {
  [FilterType.ALL]: 'All movies',
  [FilterType.WATCHLIST]: 'Watchlist',
  [FilterType.HISTORY]: 'History',
  [FilterType.FAVORITES]: 'Favorites',
};

const createFilterItemTemplate = (filter, isAllMovies) => {
  const filterName = filter.name;
  let countElement = `<span class="main-navigation__item-count">${filter.count}</span>`;
  let activeClass = '';

  if (isAllMovies) {
    countElement = '';
    activeClass = ACTIVE_CLASS;
  }

  return (
    `<a href="#${filter.name}" class="main-navigation__item ${activeClass}">
      ${filtersNamesMap[filterName]} ${countElement}
    </a>`
  );
};

const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
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
    return createFilterTemplate(this.#filters);
  }
}
