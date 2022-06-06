import { AbstractView } from 'frameworkView';

const createPopupLoadingTemplate = () => '<h2>Loading...</h2>';

export default class PopupLoadingView extends AbstractView {
  get template() {
    return createPopupLoadingTemplate();
  }
}
