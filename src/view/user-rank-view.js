import { AbstractView } from 'frameworkView';

const MOVIE_BUFF_COUNT = 21;
const FAN_COUNT = 11;
const NOVICE_COUNT = 1;

const Rank = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie buff',
};

const getRank = (watchedFilmsCount) => {
  if (watchedFilmsCount >= MOVIE_BUFF_COUNT) {
    return Rank.MOVIE_BUFF;
  }

  if (watchedFilmsCount >= FAN_COUNT) {
    return Rank.FAN;
  }

  if (watchedFilmsCount >= NOVICE_COUNT) {
    return Rank.NOVICE;
  }
};

const createUserRankTemplate = (watchedFilmsCount) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${getRank(watchedFilmsCount)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class UserRankView extends AbstractView {
  #watchedFilmsCount = null;

  constructor(watchedFilmsCount) {
    super();
    this.#watchedFilmsCount = watchedFilmsCount;
  }

  get template() {
    return createUserRankTemplate(this.#watchedFilmsCount);
  }
}
