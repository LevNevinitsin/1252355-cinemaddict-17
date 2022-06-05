import { Observable } from 'framework';
import { UpdateType } from 'const';

const UPDATE_COUNT = 1;

export default class CommentModel extends Observable {
  #commentsApiService = null;
  #filmId = null;
  #comments = null;

  constructor(commentsApiService) {
    super();
    this.#commentsApiService = commentsApiService;
  }

  get comments() {
    return this.#comments;
  }

  loadComments = async (filmId) => {
    this.#filmId = filmId;

    try {
      this.#comments = await this.#commentsApiService.getComments(this.#filmId);
    } catch(err) {
      this.#comments = [];
    }

    this._notify(UpdateType.INIT);
  };

  addComment = (updateType, update) => {
    this.#comments = [
      update,
      ...this.#comments,
    ];

    this._notify(updateType, update);
  };

  deleteComment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments.splice(index, UPDATE_COUNT);
    this._notify(updateType);
  };
}
