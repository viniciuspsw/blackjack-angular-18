import { createReducer, on } from '@ngrx/store';
import { Game, GameScoreboard } from '@/core/entities';
import * as fromActions from './game.actions';

export interface GameState {
  isLoading: boolean;
  game: Game | undefined;
  scoreboard: GameScoreboard;
}

const initialState: GameState = {
  isLoading: false,
  game: undefined,
  scoreboard: {},
};

export const gameReducer = createReducer(
  initialState,
  on(
    fromActions.startGame,
    fromActions.drawCard,
    fromActions.stopGame,
    (state) => ({
      ...state,
      isLoading: true,
    })
  ),

  on(
    fromActions.startGameFailure,
    fromActions.drawCardFailure,
    fromActions.drawCardSuccess,
    fromActions.endGame,
    (state) => ({ ...state, isLoading: false })
  ),

  on(fromActions.startGameSuccess, (state, { game }) => ({
    ...state,
    game,
    isLoading: false,
  })),

  on(fromActions.updateScoreboardSuccess, (state, { scoreboard }) => ({
    ...state,
    scoreboard,
  })),

  on(fromActions.restartGame, (state) => ({
    ...state,
    scoreboard: {},
  }))
);
