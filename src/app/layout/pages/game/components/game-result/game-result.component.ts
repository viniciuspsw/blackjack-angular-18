import { Component, input, output, computed } from '@angular/core';
import { Game, GameScoreboard } from '@/core/entities';

@Component({
  selector: 'app-game-result',
  templateUrl: './game-result.component.html',
})
export class GameResultComponent {
  restart = output<void>();

  game = input<Game>();
  scoreboard = input<GameScoreboard>();

  title = computed(() => {
    const game = this.game();
    if (!game || !game.finishedAt) return;
    if (!game.winner) return 'Empate :|';
    if (game.winner.username === game.player.username) return 'Você ganhou :)';
    return 'Você perdeu :(';
  });
}
