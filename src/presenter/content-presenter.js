import { FilterView, SortView, MainContentView, FilmListView, ShowMoreButtonView } from 'view';
import { render } from 'utils';

const FILMS_COUNT = 5;
const RATING_COUNT = 2;

const RatingDescription = {
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

export default class ContentPresenter {
  mainContentComponent = new MainContentView();

  init = (siteMainElement, filmModel) => {
    this.siteMainElement = siteMainElement;
    this.filmModel = filmModel;
    this.films = [...this.filmModel.getFilms()];
    render(new FilterView(), this.siteMainElement);
    render(new SortView(), this.siteMainElement);
    this.filmsListComponent = new FilmListView(this.films, FILMS_COUNT);
    render(this.filmsListComponent, this.mainContentComponent.getElement());
    render(new ShowMoreButtonView(), this.filmsListComponent.getElement());
    const filmsSortedByRating = this.filmModel.getFilmsSortedBy('rating');

    render(
      new FilmListView(filmsSortedByRating, RATING_COUNT, RatingDescription.TOP_RATED),
      this.mainContentComponent.getElement()
    );

    const filmsSortedByCommentsCount = this.filmModel.getFilmsSortedBy('commentsCount');

    render(
      new FilmListView(filmsSortedByCommentsCount, RATING_COUNT, RatingDescription.MOST_COMMENTED),
      this.mainContentComponent.getElement()
    );

    render(this.mainContentComponent, this.siteMainElement);
  };
}


