import { AbstractView } from 'frameworkView';
import { FilterType } from 'const';
import cn from 'classnames';

const BASE_CLASS = 'main-navigation__item';
const ACTIVE_MODIFIER = 'active';
const activeClass = `${BASE_CLASS}--${ACTIVE_MODIFIER}`;

const filtersNamesMap = {
  [FilterType.ALL]: 'All movies',
  [FilterType.WATCHLIST]: 'Watchlist',
  [FilterType.HISTORY]: 'History',
  [FilterType.FAVORITES]: 'Favorites',
};

const createFilterTemplate = (filter) => {
  const filterName = filter.name;
  const isFilterAll = filterName === FilterType.ALL;

  const countElement = !isFilterAll
    ? `<span class="main-navigation__item-count">${filter.count}</span>`
    : '';

  const filterClass = cn(BASE_CLASS, { [activeClass]: isFilterAll });

  return (
    `<a href="#${filter.name}" class="${filterClass}">
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
