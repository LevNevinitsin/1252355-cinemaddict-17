import { Observable } from 'framework';

const UPDATE_COUNT = 1;

export default class PopupModel extends Observable {
  #films;

  constructor(films) {
    super();
    this.#films = films;
  }

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films.splice(index, UPDATE_COUNT, update);
    this._notify(updateType, update);
  };
}

