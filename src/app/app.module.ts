import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ElaboratorLobbyComponent } from './component/elaborator-lobby/elaborator-lobby.container';
import { ElaboratorReviewLobbyComponent } from './component/elaborator-review-lobby/elaborator-review-lobby.container';
import { ElaboratorQuestionComponent } from './component/elaborator-question/elaborator-question.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { StoreModule } from '@ngrx/store';
import {
  ElaboratorEffect,
  ElaboratorState,
  elaboratorReducer,
  ReviewState,
  reviewReducer,
} from './state';
import { EffectsModule } from '@ngrx/effects';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

export interface AppState {
  elaborator: ElaboratorState;
  review: ReviewState;
}

@NgModule({
  declarations: [
    AppComponent,
    ElaboratorLobbyComponent,
    ElaboratorQuestionComponent,
    ElaboratorReviewLobbyComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    MatIconModule,
    MatCheckboxModule,
    StoreModule.forRoot({
      elaborator: elaboratorReducer,
      review: reviewReducer,
    }),
    EffectsModule.forRoot([ElaboratorEffect]),
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
