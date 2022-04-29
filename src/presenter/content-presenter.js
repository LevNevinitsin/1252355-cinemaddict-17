import { FilterView, SortView, MainContentView, FilmListView, ShowMoreButtonView } from 'view';
import {render} from '../render.js';

const FILMS_COUNT = 5;
const RATING_FILMS = 2;

const RatingDescription = {
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

export default class ContentPresenter {
  mainContentComponent = new MainContentView();
  filmsListComponent = new FilmListView(FILMS_COUNT);

  init = (siteMainElement) => {
    this.siteMainElement = siteMainElement;
    render(new FilterView(), siteMainElement);
    render(new SortView(), siteMainElement);
    render(this.filmsListComponent, this.mainContentComponent.getElement());
    render(new ShowMoreButtonView(), this.filmsListComponent.getElement());

    render(
      new FilmListView(RATING_FILMS, RatingDescription.TOP_RATED),
      this.mainContentComponent.getElement()
    );

    render(
      new FilmListView(RATING_FILMS, RatingDescription.MOST_COMMENTED),
      this.mainContentComponent.getElement()
    );

    render(this.mainContentComponent, this.siteMainElement);
  };
}


