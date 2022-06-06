import { ApiService } from 'framework';
import { Method } from 'const';

const RESOURCE_ADDRESS = 'comments';

export default class CommentsApiService extends ApiService {
  getComments = (filmId) => (
    this._load({url: `${RESOURCE_ADDRESS}/${filmId}`})
      .then(ApiService.parseResponse)
  );

  addComment = async (comment, filmId) => {
    const response = await this._load({
      url: `${RESOURCE_ADDRESS}/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  deleteComment = async (comment) => {
    const response = await this._load({
      url: `${RESOURCE_ADDRESS}/${comment.id}`,
      method: Method.DELETE,
    });

    return response;
  };
}
