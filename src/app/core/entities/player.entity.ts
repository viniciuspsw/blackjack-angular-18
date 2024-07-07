export interface IPlayer {
  username: string;
}

export type PlayerUsername = string;

export class Player {
  username: PlayerUsername;

  constructor({ username }: IPlayer) {
    this.username = username;
  }
}
