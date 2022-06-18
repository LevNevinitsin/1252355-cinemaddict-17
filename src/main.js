import { ContentPresenter } from 'presenter';
import { FilmModel, FilterModel } from 'model';
import { AUTHORIZATION, END_POINT } from 'const';
import { FilmsApiService } from 'api';

const bodyElement = document.querySelector('body');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteMainElement = bodyElement.querySelector('.main');
const siteFooterElement = bodyElement.querySelector('.footer');
const statisticsElement = siteFooterElement.querySelector('.footer__statistics');

const filmModel = new FilmModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const contentPresenter = new ContentPresenter();

contentPresenter.init(
  siteHeaderElement,
  bodyElement,
  siteMainElement,
  siteFooterElement,
  statisticsElement,
  filmModel,
  filterModel,
);

filmModel.init();
