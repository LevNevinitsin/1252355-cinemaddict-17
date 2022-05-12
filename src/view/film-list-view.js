import { AbstractView } from 'frameworkView';

const extraBlockModificator = 'extra';

const createFilmListTemplate = (listTitle) => {
  let modificatorClass = '';
  let listTitleTemplate = (
    '<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>'
  );

  if (listTitle) {
    modificatorClass = `films-list--${extraBlockModificator}`;
    listTitleTemplate = `<h2 class="films-list__title">${listTitle}</h2>`;
  }

  return `<section class="films-list ${modificatorClass}">${listTitleTemplate}</section>`;
};

export default class FilmListView extends AbstractView {
  #listTitle;

  constructor(listTitle = null) {
    super();
    this.#listTitle = listTitle;
  }

  get template() {
    return createFilmListTemplate(this.#listTitle);
  }
}
