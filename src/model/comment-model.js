import { Observable } from 'framework';
import { generateComments } from 'mock';

const UPDATE_COUNT = 1;

export default class CommentModel extends Observable {
  #filmId = null;
  #filmModel = null;
  #comments = null;

  constructor(filmId, filmModel) {
    super();
    this.#filmId = filmId;
    this.#filmModel = filmModel;
    this.#comments = generateComments(this.#filmModel.getFilm(this.#filmId).commentsIds);
  }

  get comments() {
    return this.#comments;
  }

  addComment = (updateType, update) => {
    this.#comments = [
      update,
      ...this.#comments,
    ];

    this._notify(updateType, update);
  };

  deleteComment = (updateType, update) => {
    const index = this.#comments.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments.splice(index, UPDATE_COUNT);
    this._notify(updateType);
  };
}
