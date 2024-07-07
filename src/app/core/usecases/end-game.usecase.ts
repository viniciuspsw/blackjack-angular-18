import { Injectable } from '@angular/core';
import { Game, Player } from '../entities';

@Injectable()
export class EndGameUsecase {
  execute({ game, winner }: { game: Game; winner: Player | null }) {
    if (game.finishedAt) {
      throw new Error('Game already ended');
    }
    game.end(winner);
  }
}
