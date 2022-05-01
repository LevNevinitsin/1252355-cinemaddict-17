import { UserRankView, FilmsCountView } from 'view';
import { ContentPresenter, PopupPresenter } from 'presenter';
import { FilmModel, CommentModel } from 'model';
import { render } from 'utils';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const statisticsElement = siteFooterElement.querySelector('.footer__statistics');

const commentModel = new CommentModel();
const filmModel = new FilmModel();
const contentPresenter = new ContentPresenter();
const popupPresenter = new PopupPresenter();

render(new UserRankView(), siteHeaderElement);
contentPresenter.init(siteMainElement, filmModel);
render(new FilmsCountView(), statisticsElement);
popupPresenter.init(siteFooterElement, filmModel, commentModel);
