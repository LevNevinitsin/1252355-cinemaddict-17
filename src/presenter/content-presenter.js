import {
  UserRankView,
  SortView,
  MainContentView,
  FilmListView,
  FilmsContainerView,
  ShowMoreButtonView,
  NoFilmsView,
  FilmsCountView,
} from 'view';

import { RenderPosition, render, remove } from 'framework';
import { FilterType, SortType, UserAction, UpdateType } from 'const';
import { FilmPresenter, FilterPresenter, PopupPresenter } from 'presenter';
import { FilmModel } from 'model';

const FILMS_STEP_LIMIT = 5;
const RATING_COUNT = 2;
const BUTTON_TAG_NAME = 'BUTTON';

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
  #filterModel;

  #userRankComponent;
  #sortComponent;
  #filmsListComponent = new FilmListView();
  #filmsContainerComponent;
  #noFilmsComponent;
  #showMoreButtonComponent;
  #mainContentComponent = new MainContentView();

  #filmPresenter = new Map();
  #filterPresenter = null;
  #popupPresenter = null;

  #filterType = FilterType.ALL;
  #currentSortType = SortType.DEFAULT;
  #renderedFilmsCount;

  get films() {
    this.#filterType = this.#filterModel.filter;
    const filteredFilms = this.#filterPresenter.filtersMap[this.#filterType].filter();

    if (this.#currentSortType === SortType.DEFAULT) {
      return filteredFilms;
    }

    return FilmModel.sortFilms(filteredFilms, this.#currentSortType);
  }

  init = (
    siteHeaderElement,
    bodyElement,
    siteMainElement,
    siteFooterElement,
    statisticsElement,
    filmModel,
    filterModel
  ) => {
    this.#bodyElement = bodyElement;
    this.#siteHeaderElement = siteHeaderElement;
    this.#siteMainElement = siteMainElement;
    this.#siteFooterElement = siteFooterElement;
    this.#statisticsElement = statisticsElement;
    this.#filmModel = filmModel;
    this.#filterModel = filterModel;
    this.#renderedFilmsCount = FILMS_STEP_LIMIT;

    this.#filterPresenter = new FilterPresenter(
      siteMainElement, this.#filterModel, this.#filmModel
    );

    this.#filterPresenter.init();
    this.#filmModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#renderRank();
    this.#renderMainList();

    const totalFilmsCount = this.#filmModel.films.length;

    if (totalFilmsCount) {
      this.#renderFilmsList(
        this.#filmModel.topRatingFilms, RATING_COUNT, ListDescription.TOP_RATED
      );

      this.#renderFilmsList(
        this.#filmModel.mostCommentedFilms, RATING_COUNT, ListDescription.MOST_COMMENTED
      );
    }

    render(this.#mainContentComponent, this.#siteMainElement);
    render(new FilmsCountView(totalFilmsCount), this.#statisticsElement);

    this.#popupPresenter = new PopupPresenter(
      this.#siteFooterElement, this.#bodyElement, this.#filmModel, this.#handleViewAction
    );
  };

  #renderRank = () => {
    const watchedFilmsCount = this.#filterPresenter.filtersMap[FilterType.HISTORY].filter().length;

    if (watchedFilmsCount) {
      this.#userRankComponent = new UserRankView(watchedFilmsCount);
      render(this.#userRankComponent, this.#siteHeaderElement);
    }
  };

  #clearRank = () => {
    remove(this.#userRankComponent);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);

    render(
      this.#sortComponent, this.#filterPresenter.filterComponent.element, RenderPosition.AFTEREND
    );

    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderNoFilms = () => {
    this.#noFilmsComponent = new NoFilmsView(this.#filterType);
    render(this.#noFilmsComponent, this.#filmsListComponent.element);

    render(
      this.#filmsListComponent,
      this.#filterPresenter.filterComponent.element,
      RenderPosition.AFTEREND
    );
  };

  #renderMainList = (resetRenderedFilmsCount) => {
    const films = this.films;
    const filmsCount = films.length;
    const renderedStepsCount = Math.ceil(this.#renderedFilmsCount / FILMS_STEP_LIMIT);
    let filmsToRenderCount;

    if (!filmsCount) {
      this.#renderNoFilms();
      return;
    }

    if (resetRenderedFilmsCount) {
      filmsToRenderCount = FILMS_STEP_LIMIT;
    } else {
      const stepsToRenderCount = Math.ceil(filmsCount / FILMS_STEP_LIMIT);

      if (renderedStepsCount === stepsToRenderCount && filmsCount > this.#renderedFilmsCount) {
        filmsToRenderCount = filmsCount;
      } else {
        filmsToRenderCount = this.#renderedFilmsCount;
      }
    }

    this.#renderSort();
    this.#renderFilmsList(films, filmsToRenderCount);

    if (filmsCount > renderedStepsCount * FILMS_STEP_LIMIT) {
      this.#renderShowMoreButton();
    }
  };

  #clearMainList = (resetSortType) => {
    if (this.#sortComponent) {
      remove(this.#sortComponent);
    }

    if (this.#noFilmsComponent) {
      remove(this.#noFilmsComponent);
    }

    const mainListPresentersMap = this.#filmPresenter.get(ListDescription.MAIN);
    remove(this.#filmsContainerComponent);
    mainListPresentersMap.forEach((presenter) => presenter.destroy());
    mainListPresentersMap.clear();
    remove(this.#showMoreButtonComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #refreshMainList = ({resetRenderedFilmsCount = true, resetSortType = false} = {}) => {
    this.#clearMainList(resetRenderedFilmsCount);
    this.#renderMainList(resetSortType);
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

  #renderFilm = (film, container, listType = ListDescription.MAIN) => {
    const filmPresenter = new FilmPresenter(container, this.#handleViewAction);
    filmPresenter.init(film);
    this.#filmPresenter.get(listType).set(film.id, filmPresenter);

    filmPresenter.filmComponent.setClickHandler((evt) => {
      if (this.#popupPresenter?.filmId === film.id) {
        return;
      }

      if (evt.target.tagName !== BUTTON_TAG_NAME) {
        this.#popupPresenter.init(film);
      }
    });
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    render(this.#showMoreButtonComponent, this.#filmsListComponent.element);
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
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
      case UpdateType.MINOR:
        if (this.#popupPresenter.isOpened()) {
          this.#popupPresenter.refreshPopupTopContainer();
        }

        this.#handleRatingFilmChange(data);
        this.#refreshMainList({resetRenderedFilmsCount: false});
        break;
      case UpdateType.SUPERMINOR:
        if (this.#popupPresenter.isOpened()) {
          this.#popupPresenter.refreshPopupTopContainer();
        }

        this.#handleRatingFilmChange(data);
        this.#clearRank();
        this.#renderRank();
        this.#refreshMainList({resetRenderedFilmsCount: false});
        break;
      case UpdateType.MAJOR:
        this.#refreshMainList({resetSortType: true});
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearMainList();
    this.#renderMainList();
  };

  #handleRatingFilmChange = (updatedFilm) => {
    const filmPresenters = Array.from(this.#filmPresenter.keys())
      .filter((listType) => listType !== ListDescription.MAIN)
      .map((listType) => this.#filmPresenter.get(listType).get(updatedFilm.id))
      .filter((presenter) => presenter);

    filmPresenters.forEach((presenter) => presenter.init(updatedFilm));
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
}
