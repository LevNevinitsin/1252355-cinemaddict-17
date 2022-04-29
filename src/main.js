import UserRankView from './view/user-rank-view.js';
import FilmsCountView from './view/films-count-view.js';
import FilterView from './view/filter-view.js';
import ContentPresenter    from './presenter/content-presenter.js';
import PopupPresenter      from './presenter/popup-presenter.js';
import SortView            from './view/sort-view.js';
import {render}            from './render.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement   = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const statisticsElement = siteFooterElement.querySelector('.footer__statistics');

const contentPresenter    = new ContentPresenter();
const popupPresenter      = new PopupPresenter();

render(new UserRankView(), siteHeaderElement);
render(new FilterView(), siteHeaderElement);
render(new SortView(), siteMainElement);
contentPresenter.init(siteMainElement);
render(new FilmsCountView(), statisticsElement);
popupPresenter.init(siteFooterElement);
