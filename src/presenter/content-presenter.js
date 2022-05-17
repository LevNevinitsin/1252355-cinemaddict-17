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
import { FilterType, SortType } from 'const';
import { FilmPresenter } from 'presenter';
import { updateItem } from 'utils';

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
  #commentModel;
  #films;
  #sortComponent;
  #filmsListComponent = new FilmListView();
  #filmsContainerComponent;
  #showMoreButtonComponent;
  #renderedFilmsCount;
  #mainContentComponent = new MainContentView();

  #filmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  init = (
    siteHeaderElement,
    bodyElement,
    siteMainElement,
    siteFooterElement,
    statisticsElement,
    filmModel,
    commentModel
  ) => {
    this.#bodyElement = bodyElement;
    this.#siteHeaderElement = siteHeaderElement;
    this.#siteMainElement = siteMainElement;
    this.#siteFooterElement = siteFooterElement;
    this.#statisticsElement = statisticsElement;
    this.#filmModel = filmModel;
    this.#commentModel = commentModel;
    this.#films = [...this.#filmModel.films];

    const filters = generateFilter(this.#films);
    const watchedFilmsCount = filters.find((filter) => filter.name === FilterType.HISTORY).count;
    const filmsCount = this.#films.length;

    if (watchedFilmsCount) {
      render(new UserRankView(watchedFilmsCount), this.#siteHeaderElement);
    }

    render(new FilterView(filters), this.#siteMainElement);
    this.#renderSort();

    if (!filmsCount) {
      render(new NoFilmsView(), this.#filmsListComponent.element);
      render(this.#filmsListComponent, this.#mainContentComponent.element);
    } else {
      this.#renderMainList(filmsCount);

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
    this.#sortComponent = new SortView();
    render(this.#sortComponent, this.#siteMainElement);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderMainList = (filmsCount) => {
    this.#renderFilmsList(this.#films, FILMS_STEP_LIMIT);

    if (filmsCount > FILMS_STEP_LIMIT) {
      this.#renderShowMoreButton();
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);
    this.#clearFilmsList();
    this.#renderMainList(this.#films.length);
  };

  #clearFilmsList = () => {
    const mainListPresentersMap = this.#filmPresenter.get(ListDescription.MAIN);
    remove(this.#filmsContainerComponent);
    mainListPresentersMap.forEach((presenter) => presenter.destroy());
    mainListPresentersMap.clear();
    remove(this.#showMoreButtonComponent);
  };

  #sortFilms = (sortType) => {
    this.#currentSortType = sortType;

    if (sortType === SortType.DEFAULT) {
      this.#films = [...this.#filmModel.films];
      return;
    }

    this.#films = this.#filmModel.getFilmsSortedBy(sortType);
  };

  #renderFilmsList = (films, filmsCount, listTitle = null) => {
    const filmsListComponent = !listTitle ? this.#filmsListComponent : new FilmListView(listTitle);
    const renderPosition = !listTitle ? RenderPosition.AFTERBEGIN : RenderPosition.BEFOREEND;
    const filmsContainerComponent = new FilmsContainerView();
    filmsCount = Math.min(films.length, filmsCount);

    if (!listTitle) {
      this.#filmsContainerComponent = filmsContainerComponent;
      this.#renderedFilmsCount = filmsCount;
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
    updateItem(this.#films, updatedFilm);

    const filmPresenters = Array.from(this.#filmPresenter.values())
      .map((listPresentersMap) => listPresentersMap.get(updatedFilm.id))
      .filter((presenter) => presenter);

    filmPresenters.forEach((presenter) => presenter.init(updatedFilm));
    filmPresenters.find((presenter) => presenter.isOpened())?.initPopupTopContainer();
  };

  #handleShowMoreButtonClick = () => {
    this.#filmsListComponent.element.remove();

    this.#films
      .slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_STEP_LIMIT)
      .forEach((film) => this.#renderFilm(film, this.#filmsContainerComponent.element));

    render(this.#filmsListComponent, this.#mainContentComponent.element, RenderPosition.AFTERBEGIN);
    this.#renderedFilmsCount += FILMS_STEP_LIMIT;

    if (this.#renderedFilmsCount >= this.#films.length) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #renderFilm = (film, container, listType = ListDescription.MAIN) => {
    const filmPresenter = new FilmPresenter(
      container,
      this.#bodyElement,
      this.#siteFooterElement,
      this.#handleModeChange,
      this.#handleFilmChange,
      this.#filmModel,
      this.#commentModel
    );

    filmPresenter.init(film);
    this.#filmPresenter.get(listType).set(film.id, filmPresenter);
  };
}
