import { Component, input, output, signal } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Card, IHandCard, Player } from '@/core/entities';

@Component({
  selector: 'app-game-hand',
  templateUrl: './game-hand.component.html',
})
export class GameHandComponent {
  player = input<Player>();
  cards = input<IHandCard[]>();
  score = input<number>();
  canDropCard = input<boolean>();
  animated = input<boolean>(true);
  isDragging = signal<boolean>(false);
  isDroppingToDelete = signal<boolean>(false);
  dropCard = output<{ card: Card; player: Player }>();

  onDragStart(): void {
    this.isDragging.set(true);
  }

  onDragEnd(): void {
    this.isDragging.set(false);
  }

  onDropIntoDeleteContainer(event: CdkDragDrop<Card>) {
    this.isDroppingToDelete.set(false);
    this.dropCard.emit({ card: event.item.data, player: this.player()! });
  }

  onEnterDeleteContainer(): void {
    this.isDroppingToDelete.set(true);
  }

  onLeaveDeleteContainer(): void {
    this.isDroppingToDelete.set(false);
  }
}
