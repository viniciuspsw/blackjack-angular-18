import { Injectable } from '@angular/core';
import { Card, Game, Player } from '../entities';

@Injectable()
export class DropCardFromHandUsecase {
  execute({
    game,
    player,
    card,
  }: {
    game: Game;
    player: Player;
    card: Card;
  }): void {
    if (!game.canRemoveCardFromHand(player)) {
      throw new Error('Player has already removed a card from hand');
    }
    game.removeCardFromHand(player, card);
  }
}
