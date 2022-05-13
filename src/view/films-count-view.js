import { AbstractView } from 'frameworkView';
import { pluralize, split3 } from 'utils';

const MOVIE_WORD = 'movie';

const createFilmsCountTemplate = (filmsCount) => (
  `<p>${split3(filmsCount)} ${pluralize(filmsCount, MOVIE_WORD, false)} inside</p>`
);

export default class FilmsCountView extends AbstractView {
  #filmsCount = null;

  constructor(filmsCount) {
    super();
    this.#filmsCount = filmsCount;
  }

  get template() {
    return createFilmsCountTemplate(this.#filmsCount);
  }
}
