import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Card } from '../entities';

export const DECK_REPOSITORY = new InjectionToken<DeckRepository>(
  'DECK_REPOSITORY'
);

export interface DeckRepository {
  create(): Observable<string>;
  drawCards(params: { deckId: string; count: number }): Observable<Card[]>;
}
