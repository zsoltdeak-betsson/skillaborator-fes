import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError, withLatestFrom, tap } from 'rxjs/operators';
import { ElaboratorAction } from './elaborator.action';
import { ElaboratorService, LocalStorageService } from '../../service';
import {
  Question,
  EvaluationResult,
} from '../../component/elaborator-question.model';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app';
import { getSelectedAnswers, getQuestions } from './elaborator.selector';
import { PREVIOUS_QUESTION_IDS_STORAGE_KEY } from 'src/app/service/utils/localstorage.service';

@Injectable()
export class ElaboratorEffect {
  getQuestion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ElaboratorAction.getQuestion),
      mergeMap(({ selectedAnswerIds }) =>
        this.service.getQuestion(selectedAnswerIds).pipe(
          tap((question: Question) => {
            LocalStorageService.push(
              PREVIOUS_QUESTION_IDS_STORAGE_KEY,
              question.id
            );
          }),
          map((question: Question) =>
            ElaboratorAction.getQuestionSuccess(question)
          ),
          catchError((err) => {
            console.error(JSON.stringify(err));
            return of(ElaboratorAction.getQuestionFail());
          })
        )
      )
    )
  );

  evaluateAnswers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ElaboratorAction.evaluateAnswers),
      withLatestFrom(this.store.select(getSelectedAnswers)),
      mergeMap(([, selectedAnswers]) =>
        this.service.postSelectedAnswers(selectedAnswers).pipe(
        withLatestFrom(this.store.select(getQuestions)),
          map(([evaluationResult, questions]: [EvaluationResult, Question[]]) =>
            ElaboratorAction.evaluateAnswersSuccess(evaluationResult, questions)
          ),
          catchError((err) => {
            console.error(JSON.stringify(err));
            return of(ElaboratorAction.evaluateAnswersFail());
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private service: ElaboratorService,
    private store: Store<AppState>
  ) {}
}
