import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';
import { ElaboratorAction } from './elaborator.action';
import { ElaboratorService } from '../../service';
import {
  Question,
  EvaluationResult,
  SelectedAnswer,
  SelectedAndRightAnswer,
} from '../../component/elaborator-question.model';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app';
import { getSelectedAnswers, getQuestions } from './elaborator.selector';

@Injectable()
export class ElaboratorEffect {
  getQuestion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ElaboratorAction.getQuestion),
      mergeMap(({ selectedAnswerIds }) =>
        this.service.getQuestion(selectedAnswerIds).pipe(
          map((question: Question) => {
            const randomizedQuestion = this.randomize(question);
            return ElaboratorAction.getQuestionSuccess(randomizedQuestion);
          }),
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
      mergeMap(({ selectedAnswerIds }) =>
        this.service.getSelectedAnswers(selectedAnswerIds).pipe(
          withLatestFrom(
            this.store.select(getQuestions),
            this.store.select(getSelectedAnswers)
          ),
          map(
            ([evaluationResult, questions, selectedAnswers]: [
              EvaluationResult,
              Question[],
              SelectedAnswer[]
            ]) => {
              const selectedAndRightAnswers: SelectedAndRightAnswer[] = selectedAnswers.map(
                (selectedAnswer) => ({
                  ...selectedAnswer,
                  rightAnswerIds:
                    evaluationResult.rightAnswersByQuestions[
                      selectedAnswer.questionId
                    ],
                })
              );
              return ElaboratorAction.evaluateAnswersSuccess(
                selectedAndRightAnswers,
                evaluationResult.score,
                questions
              );
            }
          ),
          catchError((err) => {
            console.error(JSON.stringify(err));
            return of(ElaboratorAction.evaluateAnswersFail());
          })
        )
      )
    )
  );

  private randomize(question: Question): Question {
    const randomIndex1 = Math.floor(Math.random() * question.answers.length);
    const randomIndex2 = Math.floor(Math.random() * question.answers.length);
    const temp = question.answers[randomIndex1];
    question.answers[randomIndex1] = question.answers[randomIndex2];
    question.answers[randomIndex2] = temp;
    return question;
  }

  constructor(
    private actions$: Actions,
    private service: ElaboratorService,
    private store: Store<AppState>
  ) {}
}
