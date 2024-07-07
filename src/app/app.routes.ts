import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@/layout/pages/game/game.module').then((m) => m.GameModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
