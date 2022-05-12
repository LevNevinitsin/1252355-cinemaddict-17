import { AbstractView } from 'frameworkView';

const createPopupCommentListTemplate = () => '<ul class="film-details__comments-list"></ul>';

export default class PopupCommentListView extends AbstractView {
  get template() {
    return createPopupCommentListTemplate();
  }
}
