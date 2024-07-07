import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Card, Game, Player } from '../entities';
import { DECK_REPOSITORY } from '../repositories';

@Injectable()
export class DrawCardUsecase {
  readonly deckRepository = inject(DECK_REPOSITORY);

  execute({
    game,
    player,
    visible,
  }: {
    game: Game;
    player: Player;
    visible: boolean;
  }): Observable<{ card: Card; player: Player; visible: boolean }> {
    if (!game.canDraw(player)) {
      throw new Error('Player cannot draw');
    }
    return this.deckRepository
      .drawCards({ deckId: game.deck.id, count: 1 })
      .pipe(map((cards) => ({ card: cards[0], player, visible })));
  }
}
