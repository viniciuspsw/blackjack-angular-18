import { Component, HostListener, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Card, Player } from '@/core/entities';
import { GameState } from './store/game.reducer';
import * as fromActions from './store/game.actions';
import * as fromSelectors from './store/game.selectors';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
})
export class GameComponent {
  store = inject(Store<GameState>);
  game = toSignal(this.store.select(fromSelectors.selectGame));
  canDraw = toSignal(this.store.select(fromSelectors.selectCanDraw), {
    initialValue: false,
  });
  isLoading = toSignal(this.store.select(fromSelectors.selectIsLoading), {
    initialValue: false,
  });
  scoreboard = toSignal(this.store.select(fromSelectors.selectScoreboard));

  play({ username }: { username: string }): void {
    this.store.dispatch(fromActions.startGame({ username }));
  }

  draw(): void {
    const game = this.game();
    if (!game) return;

    this.store.dispatch(
      fromActions.drawCard({ player: game.player, visible: true })
    );
  }

  stop(): void {
    const game = this.game();
    if (!game) return;

    if (!this.canDraw()) return;

    this.store.dispatch(fromActions.stopGame());
  }

  restart(): void {
    this.store.dispatch(fromActions.restartGame());
  }

  dropCard(payload: { card: Card; player: Player }): void {
    this.store.dispatch(fromActions.dropHandCard(payload));
  }

  @HostListener('window:beforeunload', ['$event'])
  onLeave(event: BeforeUnloadEvent): void {
    const game = this.game();
    if (!game || game.isFinished()) return;
    event.preventDefault();
  }
}
