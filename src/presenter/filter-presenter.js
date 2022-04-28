import FilterView from '../view/filter-view.js';
import {render}   from '../render.js';

export default class FilterPresenter {
  init = (siteHeaderElement) => {
    this.siteHeaderElement = siteHeaderElement;
    render(new FilterView(), this.siteHeaderElement);
  };
}
