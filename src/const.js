const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const CallbackName = {
  WATCHLIST_CLICK: 'watchlistClick',
  WATCHED_CLICK: 'watchedClick',
  FAVORITE_CLICK: 'favoriteClick',
  CARD_CLICK: 'click',
  CLOSE_CLICK: 'closeClick',
  CTRL_ENTER_KEYDOWN: 'ctrlEnterKeydown',
};

const SortType = {
  DEFAULT: 'default',
  DATE_DESC: 'date-desc',
  RATING_DESC: 'rating-desc',
  COMMENTS_COUNT_DESC: 'comments-count-desc',
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  SUPERMINOR: 'SUPERMINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const AUTHORIZATION = 'Basic jf758urifhj';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export {
  FilterType, CallbackName, SortType, UserAction, UpdateType, AUTHORIZATION, END_POINT, Method
};
