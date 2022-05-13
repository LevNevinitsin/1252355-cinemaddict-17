import { FilterType } from 'const';

const filtersMap = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.userDetails.favorite),
};

export const generateFilter = (films) => Object.entries(filtersMap).map(
  ([filterName, filterCallback]) => ({
    name: filterName,
    count: filterCallback(films).length,
  }),
);
