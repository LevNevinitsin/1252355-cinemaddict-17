import MainContentView    from '../view/main-content-view.js';
import FilmsView          from '../view/films-view.js';
import FilmsExtraView     from '../view/films-extra-view.js';
import FilmListView       from '../view/film-list-view.js';
import FilmItemView       from '../view/film-item-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import {render}           from '../render.js';

export default class ContentPresenter {
  mainContentComponent           = new MainContentView();
  filmsComponent                 = new FilmsView();
  filmListComponent              = new FilmListView();
  showMoreButtonComponent        = new ShowMoreButtonView();
  filmsTopRatedComponent         = new FilmsExtraView();
  filmListTopRatedComponent      = new FilmListView();
  filmsMostCommentedComponent    = new FilmsExtraView();
  filmListMostCommentedComponent = new FilmListView();

  init = (siteMainElement) => {
    this.siteMainElement = siteMainElement;

    for (let i = 0; i < 5; i++) {
      render(new FilmItemView(), this.filmListComponent.getElement());
    }

    render(this.filmListComponent, this.filmsComponent.getElement());
    render(this.showMoreButtonComponent, this.filmsComponent.getElement());
    render(this.filmsComponent, this.mainContentComponent.getElement());

    for (let i = 0; i < 2; i++) {
      render(new FilmItemView(), this.filmListTopRatedComponent.getElement());
    }

    render(this.filmListTopRatedComponent, this.filmsTopRatedComponent.getElement());
    render(this.filmsTopRatedComponent, this.mainContentComponent.getElement());

    for (let i = 0; i < 2; i++) {
      render(new FilmItemView(), this.filmListMostCommentedComponent.getElement());
    }

    render(this.filmListMostCommentedComponent, this.filmsMostCommentedComponent.getElement());
    render(this.filmsMostCommentedComponent, this.mainContentComponent.getElement());

    render(this.mainContentComponent, this.siteMainElement);
  };
}


