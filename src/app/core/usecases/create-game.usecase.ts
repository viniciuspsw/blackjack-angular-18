import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Deck, Game, Player, PlayerUsername } from '../entities';
import { DECK_REPOSITORY } from '../repositories';

@Injectable()
export class CreateGameUsecase {
  readonly deckRepository = inject(DECK_REPOSITORY);

  execute({ username }: { username: PlayerUsername }): Observable<Game> {
    return this.deckRepository.create().pipe(
      map((deckId) => new Deck({ id: deckId })),
      map((deck) => {
        const player = new Player({ username });
        const dealer = new Player({ username: 'Dealer' });
        return new Game({ deck, player, dealer });
      })
    );
  }
}
