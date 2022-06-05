import { AbstractView } from 'frameworkView';

const createLoadingTemplate = () => '<h2 class="films-list__title">Loading...</h2>';

export default class LoadingView extends AbstractView {
  get template() {
    return createLoadingTemplate();
  }
}
