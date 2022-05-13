import { AbstractView } from 'frameworkView';

const Rank = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie buff',
};

const getRank = (watchedFilmsCount) => {
  if (watchedFilmsCount >= 21) {
    return Rank.MOVIE_BUFF;
  }

  if (watchedFilmsCount >= 11) {
    return Rank.FAN;
  }

  if (watchedFilmsCount >= 1) {
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
