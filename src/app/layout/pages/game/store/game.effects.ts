import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom, mapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import {
  catchError,
  debounceTime,
  exhaustMap,
  filter,
  map,
  of,
  pipe,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import {
  CreateGameUsecase,
  DrawCardUsecase,
  DrawInitialCardsUsecase,
  EndGameUsecase,
  RevealDealerCardsUsecase,
  DropCardFromHandUsecase,
} from '@/core/usecases';
import { Game } from '@/core/entities';
import { GameState } from './game.reducer';
import * as fromActions from './game.actions';
import * as fromSelectors from './game.selectors';

@Injectable()
export class GameEffects {
  actions$ = inject(Actions);
  store = inject(Store<GameState>);
  createGameUsecase = inject(CreateGameUsecase);
  drawInitialCardsUsecase = inject(DrawInitialCardsUsecase);
  drawCardUsecase = inject(DrawCardUsecase);
  revealDealerCardsUsecase = inject(RevealDealerCardsUsecase);
  endGameUsecase = inject(EndGameUsecase);
  dropCardFromHandUsecase = inject(DropCardFromHandUsecase);

  startGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.startGame),
      exhaustMap(({ username }) =>
        this.createGameUsecase.execute({ username }).pipe(
          mapResponse({
            next: (game) => fromActions.startGameSuccess({ game }),
            error: (error) => fromActions.startGameFailure({ error }),
          })
        )
      )
    )
  );

  startGameSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.startGameSuccess),
      exhaustMap(({ game }) =>
        this.drawInitialCardsUsecase.execute({ game: game! }).pipe(
          switchMap(({ dealer, player }) => [
            fromActions.drawCardSuccess({
              card: dealer[0],
              player: game.dealer,
              visible: true,
            }),
            fromActions.drawCardSuccess({
              card: dealer[1],
              player: game.dealer,
              visible: false,
            }),
            fromActions.drawCardSuccess({
              card: player[0],
              player: game.player,
              visible: true,
            }),
            fromActions.drawCardSuccess({
              card: player[1],
              player: game.player,
              visible: true,
            }),
          ]),
          catchError((error) => [fromActions.drawCardFailure({ error })])
        )
      )
    )
  );

  drawCard$ = createEffect(() =>
    this.actions$.pipe(
      pipe(ofType(fromActions.drawCard)),
      concatLatestFrom(() => this.store.select(fromSelectors.selectGame)),
      filter((_, game) => game !== undefined),
      exhaustMap(([{ player, visible }, game]) =>
        this.drawCardUsecase.execute({ game: game!, player, visible }).pipe(
          mapResponse({
            next: (result) => fromActions.drawCardSuccess(result),
            error: (error) => fromActions.drawCardFailure({ error }),
          })
        )
      )
    )
  );

  drawCardSuccess$ = createEffect(() =>
    this.actions$.pipe(
      pipe(ofType(fromActions.drawCardSuccess)),
      concatLatestFrom(() => this.store.select(fromSelectors.selectGame)),
      filter(([_, game]) => game !== undefined),
      tap(([{ card, player, visible }, game]) => {
        game!.addCardToHand(player, card, visible);
      }),
      map(() => fromActions.updateScoreboard())
    )
  );

  updateScoreboard$ = createEffect(() =>
    this.actions$.pipe(
      pipe(ofType(fromActions.updateScoreboard)),
      concatLatestFrom(() => this.store.select(fromSelectors.selectGame)),
      filter(([_, game]) => game !== undefined),
      map(([_, game]) => {
        const scoreboard = game!.getScoreboard();
        return fromActions.updateScoreboardSuccess({ scoreboard });
      })
    )
  );

  stopGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.stopGame),
      concatLatestFrom(() => this.store.select(fromSelectors.selectGame)),
      tap(([_, game]) => {
        this.revealDealerCardsUsecase.execute({ game: game! });
      }),
      switchMap(() => [
        fromActions.updateScoreboard(),
        fromActions.fullfillDealerHand(),
      ])
    )
  );

  fullfillDealerHand$ = createEffect(() =>
    this.actions$.pipe(
      pipe(ofType(fromActions.fullfillDealerHand)),
      concatLatestFrom(() => this.store.select(fromSelectors.selectGame)),
      filter(([_, game]) => game !== undefined && game!.canDraw(game!.dealer)),
      switchMap((args) => {
        const game = args[1] as Game;
        return this.drawCardUsecase
          .execute({ player: game.dealer, game, visible: true })
          .pipe(
            switchMap((result) => [
              fromActions.drawCardSuccess(result),
              fromActions.fullfillDealerHand(),
            ]),
            catchError((error) => [fromActions.drawCardFailure({ error })])
          );
      })
    )
  );

  resultObserver$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.updateScoreboardSuccess),
      concatLatestFrom(() => this.store.select(fromSelectors.selectGame)),
      filter(([_, game]) => game !== undefined),
      map(([_, game]) => game!.getResult()),
      filter((result) => result.isDraw || result.winner !== null),
      debounceTime(1_000),
      map((result) => fromActions.endGame({ winner: result.winner }))
    )
  );

  endGame$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.endGame),
        concatLatestFrom(() => this.store.select(fromSelectors.selectGame)),
        filter(([_, game]) => game !== undefined),
        tap(([{ winner }, game]) => {
          this.endGameUsecase.execute({ game: game!, winner });
        })
      ),
    { dispatch: false }
  );

  restartGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.restartGame),
      concatLatestFrom(() => this.store.select(fromSelectors.selectGame)),
      filter(([_, game]) => game !== undefined),
      map(([_, game]) =>
        fromActions.startGame({ username: game!.player.username })
      )
    )
  );

  dropHandCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.dropHandCard),
      concatLatestFrom(() => this.store.select(fromSelectors.selectGame)),
      filter(([_, game]) => game !== undefined),
      map(([{ card, player }, game]) => {
        this.dropCardFromHandUsecase.execute({ game: game!, card, player });
        return fromActions.updateScoreboard();
      }),
      catchError((error) => {
        alert('Você já removou uma carta de sua mão nesta partida.');
        return throwError(() => error);
      })
    )
  );
}
