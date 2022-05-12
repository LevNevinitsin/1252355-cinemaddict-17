import { AbstractView } from 'frameworkView';

const createMainContentTemplate = () => '<section class="films"></section>';

export default class MainContentView extends AbstractView {
  get template() {
    return createMainContentTemplate();
  }
}
