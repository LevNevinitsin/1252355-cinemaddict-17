import {
  UserRankView,
  SortView,
  MainContentView,
  FilmListView,
  FilmsContainerView,
  ShowMoreButtonView,
  NoFilmsView,
  FilmsCountView,
  LoadingView,
} from 'view';

import { RenderPosition, render, remove, UiBlocker } from 'framework';
import { FilterType, SortType, UserAction, UpdateType } from 'const';
import { FilmPresenter, FilterPresenter, PopupPresenter } from 'presenter';
import { FilmModel } from 'model';

const FILMS_STEP_LIMIT = 5;
const RATING_COUNT = 2;
const BUTTON_TAG_NAME = 'BUTTON';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

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
  #filmsListTopRatedComponent = new FilmListView(ListDescription.TOP_RATED);
  #filmsListMostCommentedComponent = new FilmListView(ListDescription.MOST_COMMENTED);

  #filmsListsComponentsMap = {
    [ListDescription.MAIN]: this.#filmsListComponent,
    [ListDescription.TOP_RATED]: this.#filmsListTopRatedComponent,
    [ListDescription.MOST_COMMENTED]: this.#filmsListMostCommentedComponent,
  };

  #filmsContainerComponent;
  #noFilmsComponent;
  #showMoreButtonComponent;
  #mainContentComponent = new MainContentView();
  #loadingComponent = new LoadingView();

  #filmPresenter = new Map();
  #filterPresenter = null;
  #popupPresenter = null;

  #filterType = FilterType.ALL;
  #currentSortType = SortType.DEFAULT;
  #renderedFilmsCount;
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);
  #ratingListsCheckersMap = null;

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

    this.#renderContent();

    this.#popupPresenter = new PopupPresenter(
      this.#siteFooterElement,
      this.#bodyElement,
      this.#handleViewAction,
      this.#uiBlocker,
      this.#filmModel,
    );

    this.#ratingListsCheckersMap = {
      [ListDescription.TOP_RATED]: {
        'doesInfoExist': this.#filmModel.hasSomeRating,
        'areValuesEqual': this.#filmModel.areAllRatingsEqual,
      },
      [ListDescription.MOST_COMMENTED]: {
        'doesInfoExist': this.#filmModel.hasSomeCommentsCount,
        'areValuesEqual': this.#filmModel.areAllCommentsCountsEqual,
      },
    };
  };

  #renderContent = () => {
    this.#renderRank();
    this.#renderMainList();

    if (!this.#isLoading) {
      if (this.#filmModel.films.length) {
        this.#renderRatingLists();
      }

      render(new FilmsCountView(this.#filmModel.films.length), this.#statisticsElement);
    }

    render(this.#mainContentComponent, this.#siteMainElement);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#filmsListComponent.element);
    render(this.#filmsListComponent, this.#mainContentComponent.element, RenderPosition.AFTERBEGIN);
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

  #renderMainList = (resetRenderedFilmsCount = true) => {
    const films = this.films;
    const filmsCount = films.length;
    let renderedStepsCount;
    let filmsToRenderCount;

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (!filmsCount) {
      this.#renderNoFilms();
      return;
    }

    if (resetRenderedFilmsCount) {
      filmsToRenderCount = FILMS_STEP_LIMIT;
    } else {
      renderedStepsCount = Math.ceil(this.#renderedFilmsCount / FILMS_STEP_LIMIT);
      const stepsToRenderCount = Math.ceil(filmsCount / FILMS_STEP_LIMIT);

      if (renderedStepsCount === stepsToRenderCount && filmsCount > this.#renderedFilmsCount) {
        filmsToRenderCount = filmsCount;
      } else {
        filmsToRenderCount = this.#renderedFilmsCount;
      }
    }

    this.#renderSort();
    this.#renderFilmsList(films, filmsToRenderCount);

    const threshold = resetRenderedFilmsCount
      ? FILMS_STEP_LIMIT
      : renderedStepsCount * FILMS_STEP_LIMIT;

    if (filmsCount > threshold) {
      this.#renderShowMoreButton();
    }
  };

  #clearMainList = (resetSortType = false) => {
    if (this.#loadingComponent) {
      remove(this.#loadingComponent);
    }

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

  #refreshMainList = ({resetSortType = false, resetRenderedFilmsCount = true} = {}) => {
    this.#clearMainList(resetSortType);
    this.#renderMainList(resetRenderedFilmsCount);
  };

  #renderRatingLists = () => {
    this.#renderRatingList(ListDescription.TOP_RATED, SortType.RATING_DESC);
    this.#renderRatingList(ListDescription.MOST_COMMENTED, SortType.COMMENTS_COUNT_DESC);
  };

  #clearRatingLists = () => {
    this.#clearRatingList(ListDescription.TOP_RATED);
    this.#clearRatingList(ListDescription.MOST_COMMENTED);
  };

  #refreshRatingLists = () => {
    this.#clearRatingLists();
    this.#renderRatingLists();
  };

  #renderFilmsList = (films, filmsCount, listTitle = null) => {
    const listType = listTitle ?? ListDescription.MAIN;
    const filmsListComponent = this.#filmsListsComponentsMap[listType];
    const renderPosition = !listTitle ? RenderPosition.AFTERBEGIN : RenderPosition.BEFOREEND;
    const filmsContainerComponent = new FilmsContainerView();
    filmsCount = Math.min(films.length, filmsCount);

    if (!listTitle) {
      this.#filmsContainerComponent = filmsContainerComponent;
      this.#renderedFilmsCount = filmsCount;
    }

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
    filmPresenter.filmComponent.setClickHandler(this.#handleFilmCardClick(film));
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    render(this.#showMoreButtonComponent, this.#filmsListComponent.element);
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
  };

  #renderRatingList = (listType, sortType) => {
    const checkersMap = this.#ratingListsCheckersMap[listType];

    if (!checkersMap.doesInfoExist()) {
      return;
    }

    this.ratingFilms = !checkersMap.areValuesEqual()
      ? FilmModel.sortFilms(this.#filmModel.films, sortType).slice(0, RATING_COUNT)
      : this.#filmModel.getRandomFilms(RATING_COUNT);

    this.#renderFilmsList(
      this.ratingFilms, RATING_COUNT, listType
    );
  };

  #clearRatingList = (listType) => {
    remove(this.#filmsListsComponentsMap[listType]);
  };

  #handleViewAction = async (actionType, updateType, update, presenter) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#setFilmPresentersSaving(update.id);

        if (this.#popupPresenter.isOpened()) {
          this.#popupPresenter.setFilmInfoSaving();
        }

        try {
          await this.#filmModel.updateFilm(updateType, update);
        } catch(err) {
          presenter.setFilmInfoAborting(this.#resetControlsState(update.id));
        }

        break;
    }

    this.#uiBlocker.unblock();
  };

  #resetControlsState = (filmId) => (
    () => {
      this.#getFilmPresenters(filmId).forEach((filmPresenter) => {
        filmPresenter.filmComponent.updateElement({
          isDisabled: false,
        });
      });

      if (this.#popupPresenter.isOpened()) {
        this.#popupPresenter.popupTopContainerComponent.updateElement({
          isDisabled: false,
        });
      }
    }
  );

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.MINOR:
        this.#updatePopupTopContainer(data);
        this.#handleRatingFilmChange(data);
        this.#refreshMainList({resetRenderedFilmsCount: false});
        break;
      case UpdateType.SUPERMINOR:
        this.#updatePopupTopContainer(data);
        this.#handleRatingFilmChange(data);
        this.#clearRank();
        this.#renderRank();
        this.#refreshMainList({resetRenderedFilmsCount: false});
        break;
      case UpdateType.HYPERMINOR:
        this.#refreshLists();
        break;
      case UpdateType.MAJOR:
        this.#refreshMainList({resetSortType: true});
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderContent();
        break;
    }
  };

  #refreshLists = () => {
    this.#refreshMainList({resetRenderedFilmsCount: false});
    this.#refreshRatingLists();
  };

  #updatePopupTopContainer = (film) => {
    if (this.#popupPresenter.isOpened()) {
      this.#popupPresenter.film = film;
      this.#popupPresenter.refreshPopupTopContainer();
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
    this.#getFilmPresenters(updatedFilm.id, true).forEach((presenter) => {
      presenter.init(updatedFilm);
      presenter.filmComponent.setClickHandler(this.#handleFilmCardClick(updatedFilm));
    });
  };

  #setFilmPresentersSaving = (filmId) => {
    this.#getFilmPresenters(filmId).forEach((presenter) => presenter.setSaving());
  };

  #getFilmPresenters = (filmId, shouldGetRating = false) => (
    Array.from(this.#filmPresenter.keys())
      .filter((listType) => !shouldGetRating || listType !== ListDescription.MAIN)
      .map((listType) => this.#filmPresenter.get(listType).get(filmId))
      .filter((presenter) => presenter)
  );

  #handleFilmCardClick = (film) => (
    (evt) => {
      if (this.#popupPresenter.isOpened() && this.#popupPresenter.filmId === film.id) {
        return;
      }

      if (evt.target.tagName !== BUTTON_TAG_NAME) {
        this.#popupPresenter.init(film);
      }
    }
  );

  #handleShowMoreButtonClick = () => {
    this.#filmsListComponent.element.remove();
    const filmsCount = this.films.length;
    const newRenderedFilmsCount = Math.min(filmsCount, this.#renderedFilmsCount + FILMS_STEP_LIMIT);
    const films = this.films.slice(this.#renderedFilmsCount, newRenderedFilmsCount);

    films.forEach((film) => this.#renderFilm(film, this.#filmsContainerComponent.element));
    render(this.#filmsListComponent, this.#mainContentComponent.element, RenderPosition.AFTERBEGIN);
    this.#renderedFilmsCount = newRenderedFilmsCount;

    if (this.#renderedFilmsCount >= filmsCount) {
      remove(this.#showMoreButtonComponent);
    }
  };
}
