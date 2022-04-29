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
  filmsListComponent = new FilmListView(FILMS_COUNT);

  init = (siteMainElement) => {
    this.siteMainElement = siteMainElement;
    render(new FilterView(), this.siteMainElement);
    render(new SortView(), this.siteMainElement);
    render(this.filmsListComponent, this.mainContentComponent.getElement());
    render(new ShowMoreButtonView(), this.filmsListComponent.getElement());

    render(
      new FilmListView(RATING_COUNT, RatingDescription.TOP_RATED),
      this.mainContentComponent.getElement()
    );

    render(
      new FilmListView(RATING_COUNT, RatingDescription.MOST_COMMENTED),
      this.mainContentComponent.getElement()
    );

    render(this.mainContentComponent, this.siteMainElement);
  };
}


