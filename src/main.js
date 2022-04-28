import UserRankPresenter   from './presenter/user-rank-presenter.js';
import FilterPresenter     from './presenter/filter-presenter.js';
import ContentPresenter    from './presenter/content-presenter.js';
import FilmsCountPresenter from './presenter/films-count-presenter.js';
import PopupPresenter      from './presenter/popup-presenter.js';
import SortView            from './view/sort-view.js';
import {render}            from './render.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement   = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const statisticsElement = siteFooterElement.querySelector('.footer__statistics');

const userRankPresenter   = new UserRankPresenter();
const filterPresenter     = new FilterPresenter();
const contentPresenter    = new ContentPresenter();
const filmsCountPresenter = new FilmsCountPresenter();
const popupPresenter      = new PopupPresenter();

userRankPresenter.init(siteHeaderElement);
filterPresenter.init(siteMainElement);
render(new SortView(), siteMainElement);
contentPresenter.init(siteMainElement);
filmsCountPresenter.init(statisticsElement);
popupPresenter.init(siteFooterElement);
