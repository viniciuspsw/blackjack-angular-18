import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DeckRepository } from '@/core/repositories';
import { Card, CardSuit } from '@/core/entities';

interface CreateDeckResponse {
  deck_id: string;
}

interface DrawCardsResponse {
  cards: Array<{ code: string; value: string; suit: string }>;
}

const parseCardValue = (value: string): number => {
  if (value === 'ACE') return 1;
  if (value === 'KING') return 10;
  if (value === 'QUEEN') return 10;
  if (value === 'JACK') return 10;
  return parseInt(value, 10);
};

@Injectable()
export class ApiDeckRepository implements DeckRepository {
  private baseUrl = `https://deckofcardsapi.com/api/deck`;

  constructor(private httpClient: HttpClient) {}

  create(): Observable<string> {
    return this.httpClient
      .get<CreateDeckResponse>(`${this.baseUrl}/new/shuffle/`)
      .pipe(map(({ deck_id }) => deck_id));
  }

  drawCards({
    count,
    deckId,
  }: {
    count: number;
    deckId: string;
  }): Observable<Card[]> {
    return this.httpClient
      .get<DrawCardsResponse>(`${this.baseUrl}/${deckId}/draw/`, {
        params: { count },
      })
      .pipe(
        map(({ cards }) =>
          cards.map(
            (card) =>
              new Card({
                code: card.code,
                value: parseCardValue(card.value),
                suit: card.suit as CardSuit,
              })
          )
        )
      );
  }
}
