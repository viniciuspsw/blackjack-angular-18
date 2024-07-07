import { createAction, props } from '@ngrx/store';
import { Card, Game, Player } from '@/core/entities';

export const startGame = createAction(
  '[Game] Start game',
  props<{ username: string }>()
);

export const startGameSuccess = createAction(
  '[Game] Game started success',
  props<{ game: Game }>()
);

export const startGameFailure = createAction(
  '[Game] Game started failure',
  props<{ error: unknown }>()
);

export const drawCard = createAction(
  '[Game] Draw card',
  props<{ player: Player; visible: boolean }>()
);

export const drawCardSuccess = createAction(
  '[Game] Draw card success',
  props<{ player: Player; card: Card; visible: boolean }>()
);

export const drawCardFailure = createAction(
  '[Game] Draw card failure',
  props<{ error: unknown }>()
);

export const stopGame = createAction('[Game] Stop game');

export const fullfillDealerHand = createAction('[Game] Fullfil dealer hand');

export const updateScoreboard = createAction('[Game] Update scoreboard');

export const updateScoreboardSuccess = createAction(
  '[Game] Update scoreboard success',
  props<{ scoreboard: Record<string, number> }>()
);

export const endGame = createAction(
  '[Game] End game',
  props<{ winner: Player | null }>()
);

export const restartGame = createAction('[Game] Restart game');

export const dropHandCard = createAction(
  '[Game] Drop hand card',
  props<{ player: Player; card: Card }>()
);
