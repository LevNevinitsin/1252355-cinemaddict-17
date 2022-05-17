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
};

const SortType = {
  DEFAULT: 'default',
  DATE_DESC: 'date-desc',
  RATING_DESC: 'rating-desc',
  COMMENTS_COUNT_DESC: 'comments-count-desc',
};

export { FilterType, CallbackName, SortType };
