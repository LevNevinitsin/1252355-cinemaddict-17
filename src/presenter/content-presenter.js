import { FilterView, SortView, MainContentView, FilmListView } from 'view';
import {render} from '../render.js';

export default class ContentPresenter {
  filmsCount = 5;
  topRatedFilmsCount = 2;
  topRatedBlockTitle = 'Top rated';
  mostCommentedFilmsCount = 2;
  mostCommentedBlockTitle = 'Most commented';
  mainContentComponent = new MainContentView();

  init = (siteMainElement) => {
    this.siteMainElement = siteMainElement;
    render(new FilterView(), siteMainElement);
    render(new SortView(), siteMainElement);
    render(new FilmListView(this.filmsCount), this.mainContentComponent.getElement());

    render(
      new FilmListView(this.topRatedFilmsCount, this.topRatedBlockTitle),
      this.mainContentComponent.getElement()
    );

    render(
      new FilmListView(this.mostCommentedFilmsCount, this.mostCommentedBlockTitle),
      this.mainContentComponent.getElement()
    );

    render(this.mainContentComponent, this.siteMainElement);
  };
}


