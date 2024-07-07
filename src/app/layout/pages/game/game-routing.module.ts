import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { GameComponent } from './game.component';

const routes: Route[] = [
  {
    path: '',
    component: GameComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class GameRoutingModule {}
