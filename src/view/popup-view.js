import { AbstractView } from 'frameworkView';

const createPopupTemplate = () => '<section class="film-details"></section>';

export default class PopupView extends AbstractView {
  get template() {
    return createPopupTemplate();
  }
}
