import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameState } from './game.reducer';

export const gameFeature = createFeatureSelector<GameState>('game');

export const selectGame = createSelector(gameFeature, (state) => state.game);

export const selectIsLoading = createSelector(
  gameFeature,
  (state) => state.isLoading
);

export const selectScoreboard = createSelector(
  gameFeature,
  (state) => state.scoreboard
);

export const selectCanDraw = createSelector(selectGame, (game) => {
  if (!game) return false;
  return game.canDraw(game.player);
});
