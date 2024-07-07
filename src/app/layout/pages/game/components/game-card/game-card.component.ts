import { Component, input } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Card } from '@/core/entities';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  animations: [
    trigger('show', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(9999px)' }),
        animate(
          '0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
    trigger('flip', [
      state('visible', style({ transform: 'rotateY(360deg)' })),
      state('hidden', style({ transform: 'rotateY(0)' })),
      transition('active => inactive', animate('1s ease-out')),
      transition('inactive => active', animate('1s ease-in')),
    ]),
  ],
})
export class GameCardComponent {
  card = input<Card>();
  visible = input<boolean>(true);
  draggable = input<boolean>(false);
  animated = input<boolean>(true);
}
