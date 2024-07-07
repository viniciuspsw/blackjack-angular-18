import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { DECK_REPOSITORY } from '@/core/repositories';
import { ApiDeckRepository } from './repositories';

@NgModule({
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: DECK_REPOSITORY,
      useClass: ApiDeckRepository,
    },
  ],
})
export class DataModule {}
