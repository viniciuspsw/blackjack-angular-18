import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { Card, Game } from '../entities';
import { DECK_REPOSITORY } from '../repositories';

@Injectable()
export class DrawInitialCardsUsecase {
  readonly deckRepository = inject(DECK_REPOSITORY);

  execute({
    game,
  }: {
    game: Game;
  }): Observable<{ player: Card[]; dealer: Card[] }> {
    const deckId = game.deck.id;
    const count = 2;

    return forkJoin({
      player: this.deckRepository.drawCards({ deckId, count }),
      dealer: this.deckRepository.drawCards({ deckId, count }),
    });
  }
}
