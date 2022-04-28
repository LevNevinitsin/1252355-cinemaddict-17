import FilmsCountView from '../view/films-count-view.js';
import {render}       from '../render.js';

export default class FilmsCountPresenter {
  init = (statisticsElement) => {
    this.statisticsElement = statisticsElement;
    render(new FilmsCountView(), this.statisticsElement);
  };
}
