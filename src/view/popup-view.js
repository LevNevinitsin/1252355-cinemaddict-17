import { AbstractView } from 'frameworkView';

const createPopupTemplate = () => (
  `<section class="film-details">
    <form class="film-details__inner" action="" method="get">

    </form>
  </section>`
);

export default class PopupView extends AbstractView {
  get template() {
    return createPopupTemplate();
  }
}
