import { generateComments } from 'mock';

export default class CommentModel {
  getFilmComments = (filmId, filmModel) => (
    generateComments(filmModel.getFilm(filmId).commentsIds)
  );
}
