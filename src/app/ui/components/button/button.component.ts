import { Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-button',
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  type = input<string>('button');
  disabled = input<boolean>(false);
  onClick = input<(event: MouseEvent) => void>();
}
