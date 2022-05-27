import { ContentPresenter } from 'presenter';
import { FilmModel } from 'model';

const bodyElement = document.querySelector('body');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteMainElement = bodyElement.querySelector('.main');
const siteFooterElement = bodyElement.querySelector('.footer');
const statisticsElement = siteFooterElement.querySelector('.footer__statistics');

const filmModel = new FilmModel();
const contentPresenter = new ContentPresenter();

contentPresenter.init(
  siteHeaderElement,
  bodyElement,
  siteMainElement,
  siteFooterElement,
  statisticsElement,
  filmModel,
);
