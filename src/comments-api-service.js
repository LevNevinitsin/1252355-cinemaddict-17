import { ApiService } from 'framework';

const RESOURCE_ADDRESS = 'comments';

export default class CommentsApiService extends ApiService {
  getComments(filmId) {
    return this._load({url: `${RESOURCE_ADDRESS}/${filmId}`})
      .then(ApiService.parseResponse);
  }
}
