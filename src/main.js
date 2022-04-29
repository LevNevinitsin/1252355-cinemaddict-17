import { UserRankView, FilmsCountView } from 'view';
import { ContentPresenter, PopupPresenter } from 'presenter';
import { render } from 'utils';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const statisticsElement = siteFooterElement.querySelector('.footer__statistics');

const contentPresenter = new ContentPresenter();
const popupPresenter = new PopupPresenter();

render(new UserRankView(), siteHeaderElement);
contentPresenter.init(siteMainElement);
render(new FilmsCountView(), statisticsElement);
popupPresenter.init(siteFooterElement);
