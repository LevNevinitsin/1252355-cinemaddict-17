import UserRankView from '../view/user-rank-view.js';
import {render}     from '../render.js';

export default class UserRankPresenter {
  init = (siteHeaderElement) => {
    this.siteHeaderElement = siteHeaderElement;
    render(new UserRankView(), this.siteHeaderElement);
  };
}
