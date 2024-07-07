import { Component, input } from '@angular/core';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  standalone: true,
  imports: [LoaderComponent],
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  isLoading = input<boolean>(false);
}
