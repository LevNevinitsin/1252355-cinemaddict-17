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

  get commentsIds() {
    return this.comments.map((comment) => comment.id);
  }

  loadComments = async (filmId) => {
    this.#filmId = filmId;

    try {
      this.#comments = await this.#commentsApiService.getComments(this.#filmId);
    } catch(err) {
      this.#comments = [];
    }

    this._notify(UpdateType.POPUP_INIT);
  };

  addComment = async (updateType, update, filmId) => {
    try {
      const response = await this.#commentsApiService.addComment(update, filmId);
      this.#comments = response.comments;
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#commentsApiService.deleteComment(update);
      this.#comments.splice(index, UPDATE_COUNT);
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  };
}
