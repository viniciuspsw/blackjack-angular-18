import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  LayoutComponent,
  InputComponent,
  ButtonComponent,
  LoaderComponent,
} from '@/ui/components';
import { DataModule } from '@/data/data.module';
import {
  CreateGameUsecase,
  DrawCardUsecase,
  DrawInitialCardsUsecase,
  DropCardFromHandUsecase,
  EndGameUsecase,
  RevealDealerCardsUsecase,
} from '@/core/usecases';
import { GameComponent } from './game.component';
import { GameRoutingModule } from './game-routing.module';
import { GameEffects } from './store/game.effects';
import { gameReducer } from './store/game.reducer';
import { GameResultComponent } from './components/game-result/game-result.component';
import { GameHandComponent } from './components/game-hand/game-hand.component';
import { PlayFormComponent } from './components/play-form/play-form.component';
import { GameCardComponent } from './components/game-card/game-card.component';

@NgModule({
  declarations: [
    GameComponent,
    PlayFormComponent,
    GameCardComponent,
    GameHandComponent,
    GameResultComponent,
  ],
  providers: [
    CreateGameUsecase,
    DrawInitialCardsUsecase,
    DrawCardUsecase,
    GameEffects,
    RevealDealerCardsUsecase,
    EndGameUsecase,
    DropCardFromHandUsecase,
  ],
  imports: [
    StoreModule.forFeature('game', gameReducer),
    EffectsModule.forFeature(GameEffects),
    GameRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutComponent,
    InputComponent,
    ButtonComponent,
    LoaderComponent,
    DataModule,
    DragDropModule,
  ],
})
export class GameModule {}
