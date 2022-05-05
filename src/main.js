import { UserRankView, FilmsCountView } from 'view';
import { ContentPresenter } from 'presenter';
import { FilmModel, CommentModel } from 'model';
import { render } from 'utils';

const bodyElement = document.querySelector('body');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteMainElement = bodyElement.querySelector('.main');
const siteFooterElement = bodyElement.querySelector('.footer');
const statisticsElement = siteFooterElement.querySelector('.footer__statistics');

const commentModel = new CommentModel();
const filmModel = new FilmModel();
const contentPresenter = new ContentPresenter();

render(new UserRankView(), siteHeaderElement);
contentPresenter.init(bodyElement, siteMainElement, siteFooterElement, filmModel, commentModel);
render(new FilmsCountView(), statisticsElement);
