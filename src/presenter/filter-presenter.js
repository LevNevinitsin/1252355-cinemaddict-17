import { render, replace, remove } from 'framework';
import { FilterView } from 'view';
import { FilterType, UpdateType } from 'const';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filmModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, filmModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmModel = filmModel;

    this.#filmModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filtersMap() {
    const { films } = this.#filmModel;

    return {
      [FilterType.ALL]: {
        name: 'All movies',
        filter: () => films,
      },
      [FilterType.WATCHLIST]: {
        name: 'Watchlist',
        filter: () => films.filter((film) => film.userDetails.watchlist),
      },
      [FilterType.HISTORY]: {
        name: 'History',
        filter: () => films.filter((film) => film.userDetails.alreadyWatched),
      },
      [FilterType.FAVORITES]: {
        name: 'Favorites',
        filter: () => films.filter((film) => film.userDetails.favorite),
      },
    };
  }

  get filterComponent() {
    return this.#filterComponent;
  }

  init = () => {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(this.filtersMap, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
