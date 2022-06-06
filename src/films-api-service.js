import { ApiService } from 'framework';
import { snakeCase, camelCase } from 'lodash';
import { Method } from 'const';

const RESOURCE_ADDRESS = 'movies';

export default class FilmsApiService extends ApiService {
  get films() {
    return this._load({url: RESOURCE_ADDRESS})
      .then(ApiService.parseResponse)
      .then((data) => data.map(FilmsApiService.adaptToClient));
  }

  updateFilm = async (film) => {
    const response = await this._load({
      url: `${RESOURCE_ADDRESS}/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(FilmsApiService.adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return FilmsApiService.adaptToClient(parsedResponse);
  };

  static adaptToClient = (film) => {
    const adaptedFilm = {
      ...film,
      commentsIds: film.comments,
    };

    delete adaptedFilm.comments;

    return ApiService.adaptCase(adaptedFilm, camelCase);
  };

  static adaptToServer = (film) => {
    const adaptedFilm = {
      ...film,
      comments: film.commentsIds,
    };

    delete adaptedFilm.commentsIds;

    return ApiService.adaptCase(adaptedFilm, snakeCase);
  };
}
