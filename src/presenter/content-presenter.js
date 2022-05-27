import {
  UserRankView,
  FilterView,
  SortView,
  MainContentView,
  FilmListView,
  FilmsContainerView,
  ShowMoreButtonView,
  NoFilmsView,
  FilmsCountView,
} from 'view';

import { RenderPosition, render, remove } from 'framework';
import { generateFilter } from 'mock';
import { FilterType, SortType, UserAction, UpdateType } from 'const';
import { FilmPresenter } from 'presenter';

const FILMS_STEP_LIMIT = 5;
const RATING_COUNT = 2;

const ListDescription = {
  MAIN: 'Main',
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

export default class ContentPresenter {
  #bodyElement;
  #siteHeaderElement;
  #siteMainElement;
  #siteFooterElement;
  #statisticsElement;
  #filmModel;
  #filterComponent;
  #sortComponent;
  #filmsListComponent = new FilmListView();
  #filmsContainerComponent;
  #showMoreButtonComponent;
  #renderedFilmsCount;
  #mainContentComponent = new MainContentView();

  #filmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  get films() {
    if (this.#currentSortType === SortType.DEFAULT) {
      return this.#filmModel.films;
    }

    return this.#filmModel.getFilmsSortedBy(this.#currentSortType);
  }

  init = (
    siteHeaderElement,
    bodyElement,
    siteMainElement,
    siteFooterElement,
    statisticsElement,
    filmModel,
  ) => {
    this.#bodyElement = bodyElement;
    this.#siteHeaderElement = siteHeaderElement;
    this.#siteMainElement = siteMainElement;
    this.#siteFooterElement = siteFooterElement;
    this.#statisticsElement = statisticsElement;
    this.#filmModel = filmModel;
    this.#renderedFilmsCount = FILMS_STEP_LIMIT;

    const films = this.films;
    const filters = generateFilter(this.films);
    this.#filterComponent = new FilterView(filters);
    const watchedFilmsCount = filters.find((filter) => filter.name === FilterType.HISTORY).count;
    const filmsCount = films.length;

    this.#filmModel.addObserver(this.#handleModelEvent);

    if (watchedFilmsCount) {
      render(new UserRankView(watchedFilmsCount), this.#siteHeaderElement);
    }

    render(this.#filterComponent, this.#siteMainElement);

    if (!filmsCount) {
      render(new NoFilmsView(), this.#filmsListComponent.element);
      render(this.#filmsListComponent, this.#mainContentComponent.element);
    } else {
      this.#renderMainList();

      this.#renderFilmsList(
        this.#filmModel.topRatingFilms, RATING_COUNT, ListDescription.TOP_RATED
      );

      this.#renderFilmsList(
        this.#filmModel.mostCommentedFilms, RATING_COUNT, ListDescription.MOST_COMMENTED
      );
    }

    render(this.#mainContentComponent, this.#siteMainElement);
    render(new FilmsCountView(filmsCount), this.#statisticsElement);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#sortComponent, this.#filterComponent.element, RenderPosition.AFTEREND);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderMainList = () => {
    this.#renderSort();
    this.#renderFilmsList(this.films, this.#renderedFilmsCount);

    if (this.films.length > this.#renderedFilmsCount) {
      this.#renderShowMoreButton();
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmsList();
    this.#renderMainList();
  };

  #clearFilmsList = ({resetRenderedFilmsCount = false, resetSortType = false} = {}) => {
    remove(this.#sortComponent);
    const mainListPresentersMap = this.#filmPresenter.get(ListDescription.MAIN);
    remove(this.#filmsContainerComponent);
    mainListPresentersMap.forEach((presenter) => presenter.destroy());
    mainListPresentersMap.clear();
    remove(this.#showMoreButtonComponent);

    if (resetRenderedFilmsCount) {
      this.#renderedFilmsCount = FILMS_STEP_LIMIT;
    } else {
      this.#renderedFilmsCount = Math.min(this.films.length, this.#renderedFilmsCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderFilmsList = (films, filmsCount, listTitle = null) => {
    const filmsListComponent = !listTitle ? this.#filmsListComponent : new FilmListView(listTitle);
    const renderPosition = !listTitle ? RenderPosition.AFTERBEGIN : RenderPosition.BEFOREEND;
    const filmsContainerComponent = new FilmsContainerView();
    filmsCount = Math.min(films.length, filmsCount);

    if (!listTitle) {
      this.#filmsContainerComponent = filmsContainerComponent;
    }

    const listType = listTitle ?? ListDescription.MAIN;
    this.#filmPresenter.set(listType, new Map());

    for (let i = 0; i < filmsCount; i++) {
      this.#renderFilm(films[i], filmsContainerComponent.element, listType);
    }

    render(filmsContainerComponent, filmsListComponent.element);
    render(filmsListComponent, this.#mainContentComponent.element, renderPosition);
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    render(this.#showMoreButtonComponent, this.#filmsListComponent.element);
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
  };

  #handleModeChange = () => {
    this.#filmPresenter.forEach((listPresentersMap) => {
      listPresentersMap.forEach((presenter) => presenter.resetView());
    });
  };

  #handleFilmChange = (updatedFilm) => {
    const filmPresenters = Array.from(this.#filmPresenter.values())
      .map((listPresentersMap) => listPresentersMap.get(updatedFilm.id))
      .filter((presenter) => presenter);

    filmPresenters.forEach((presenter) => presenter.init(updatedFilm));
    filmPresenters.find((presenter) => presenter.isOpened())?.initPopupTopContainer();
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmModel.updateFilm(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#handleFilmChange(data);
        break;
      case UpdateType.MINOR:
        this.#handleFilmChange(data);
        this.#clearFilmsList();
        this.#renderMainList();
        break;
      case UpdateType.MAJOR:
        this.#handleFilmChange(data);
        this.#clearFilmsList({resetRenderedFilmsCount: true, resetSortType: true});
        this.#renderMainList();
        break;
    }
  };

  #handleShowMoreButtonClick = () => {
    this.#filmsListComponent.element.remove();
    const filmsCount = this.films.length;
    const newRenderedFilmsCount = Math.min(filmsCount, this.#renderedFilmsCount + FILMS_STEP_LIMIT);
    const films = this.films.slice(this.#renderedFilmsCount, newRenderedFilmsCount);

    films.forEach((film) => this.#renderFilm(film, this.#filmsContainerComponent.element));
    render(this.#filmsListComponent, this.#mainContentComponent.element, RenderPosition.AFTERBEGIN);
    this.#renderedFilmsCount += FILMS_STEP_LIMIT;

    if (this.#renderedFilmsCount >= filmsCount) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #renderFilm = (film, container, listType = ListDescription.MAIN) => {
    const filmPresenter = new FilmPresenter(
      container,
      this.#bodyElement,
      this.#siteFooterElement,
      this.#handleModeChange,
      this.#handleViewAction,
      this.#filmModel,
    );

    filmPresenter.init(film);
    this.#filmPresenter.get(listType).set(film.id, filmPresenter);
  };
}
