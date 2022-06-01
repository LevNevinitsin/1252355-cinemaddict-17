import { AbstractView } from 'frameworkView';

const createPopupFormTemplate = () => (
  '<form class="film-details__inner" action="" method="get"></form>'
);

export default class PopupForm extends AbstractView {
  get template() {
    return createPopupFormTemplate();
  }
}
