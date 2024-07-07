import { Injectable } from '@angular/core';
import { Game } from '../entities';

@Injectable()
export class RevealDealerCardsUsecase {
  execute({ game }: { game: Game }): void {
    game.revealCards(game.dealer);
  }
}
