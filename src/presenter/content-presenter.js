import {
  FilterView,
  SortView,
  MainContentView,
  FilmListView,
  ShowMoreButtonView,
  PopupView
} from 'view';

import {
  PopupCommentListView,
  PopupCommentItemView,
  PopupTopContainerView,
  PopupBottomContainerView,
  PopupNewCommentView,
} from 'popup';

import { render } from 'utils';

const FILMS_COUNT = 5;
const RATING_COUNT = 2;

const RatingDescription = {
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

export default class ContentPresenter {
  mainContentComponent = new MainContentView();

  init = (siteMainElement, siteFooterElement, filmModel, commentModel) => {
    this.siteMainElement = siteMainElement;
    this.siteFooterElement = siteFooterElement;
    this.filmModel = filmModel;
    this.commentModel = commentModel;
    this.films = [...this.filmModel.getFilms()];
    const popupFilmId = this.films[0].id;
    render(new FilterView(), this.siteMainElement);
    render(new SortView(), this.siteMainElement);
    this.filmsListComponent = new FilmListView(this.films, FILMS_COUNT);
    render(this.filmsListComponent, this.mainContentComponent.getElement());
    render(new ShowMoreButtonView(), this.filmsListComponent.getElement());

    render(
      new FilmListView(this.filmModel.topRatingFilms, RATING_COUNT, RatingDescription.TOP_RATED),
      this.mainContentComponent.getElement()
    );

    render(
      new FilmListView(
        this.filmModel.mostCommentedFilms,
        RATING_COUNT,
        RatingDescription.MOST_COMMENTED
      ),

      this.mainContentComponent.getElement()
    );

    render(this.mainContentComponent, this.siteMainElement);
    this.renderPopup(popupFilmId);
  };

  renderPopup = (popupFilmId) => {
    this.popupFilm = this.filmModel.getFilm(popupFilmId);
    this.popupComponent = new PopupView();
    this.popupCommentListComponent = new PopupCommentListView();
    this.popupNewCommentComponent = new PopupNewCommentView();
    this.popupTopContainerComponent = new PopupTopContainerView(this.popupFilm);
    render(this.popupTopContainerComponent, this.popupComponent.getElement());

    this.popupBottomContainerComponent = new PopupBottomContainerView(
      this.popupFilm.commentsIds.length
    );

    this.filmComments = this.commentModel.getFilmComments(popupFilmId, this.filmModel);

    this.filmComments.forEach((comment) => {
      render(new PopupCommentItemView(comment), this.popupCommentListComponent.getElement());
    });

    render(this.popupCommentListComponent, this.popupBottomContainerComponent.getElement());
    render(this.popupNewCommentComponent, this.popupBottomContainerComponent.getElement());
    render(this.popupBottomContainerComponent, this.popupComponent.getElement());
    render(this.popupComponent, this.siteFooterElement, 'afterend');
  };
}


