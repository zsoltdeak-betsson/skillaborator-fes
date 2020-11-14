import {
  Component,
  ChangeDetectionStrategy,
  HostBinding,
  OnInit,
  ChangeDetectorRef,
  ViewEncapsulation,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { Question, SelectedAndRightAnswer } from '../elaborator-question.model';
import { AppState } from '../../app.module';
import { tap, take, filter } from 'rxjs/operators';
import { getQuestions } from '../..';
import { getSelectedAndRightAnswers } from '../../state/elaborator/elaborator.selector';
import { Router } from '@angular/router';

enum AnswerSummaryState {
  Right,
  PartialWrong,
  Wrong,
}

@Component({
  selector: 'sk-elaborator-review-lobby',
  templateUrl: './elaborator-review-lobby.container.component.html',
  styleUrls: ['./elaborator-review-lobby.container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ElaboratorReviewLobbyComponent implements OnInit {
  @HostBinding('class.elaborator-review-lobby') hostCss = true;

  questions: Question[];
  selectedAndRightAnswersMap: Map<
    string,
    SelectedAndRightAnswer & { answerSummaryState: AnswerSummaryState }
  >;
  questionPreview: false;
  answerSummaryState = AnswerSummaryState;

  constructor(
    private store: Store<AppState>,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    const sub = combineLatest([
      this.store.select(getSelectedAndRightAnswers),
      this.store.select(getQuestions),
    ])
      .pipe(
        tap(([, questions]) => {
          if (!questions?.length) {
            this.router.navigate(['']);
          }
        }),
        filter(
          ([selectedAndRightAnswers, questions]) =>
            !!selectedAndRightAnswers && !!questions
        ),
        take(1)
      )
      .subscribe(
        ([selectedAndRightAnswers, questions]: [
          SelectedAndRightAnswer[],
          Question[]
        ]) => {
          this.selectedAndRightAnswersMap = new Map();

          selectedAndRightAnswers.forEach((selectedAndRightAnswer) => {
            let answerSummaryState;
            const answersRightAnswersIntersection = this.intersect(
              selectedAndRightAnswer.rightAnswerIds,
              selectedAndRightAnswer.answerIds
            );

            switch (answersRightAnswersIntersection.length) {
              case 0:
                answerSummaryState = AnswerSummaryState.Wrong;
                break;
              case selectedAndRightAnswer.rightAnswerIds.length:
                answerSummaryState = AnswerSummaryState.Right;
                break;
              default:
                answerSummaryState = AnswerSummaryState.PartialWrong;
                break;
            }

            this.selectedAndRightAnswersMap.set(
              selectedAndRightAnswer.questionId,
              { ...selectedAndRightAnswer, answerSummaryState }
            );
          });
          this.questions = questions;
          this.cdRef.markForCheck();
        }
      );
  }

  private intersect(arrA: string[], arrB: string[]): string[] {
    const intersection = [];
    const cloneB = [...arrB];

    arrA.forEach((elemA) => {
      const elemAIndexInCloneB = cloneB.indexOf(elemA);
      if (elemAIndexInCloneB === -1) {
        return;
      }
      cloneB.splice(elemAIndexInCloneB, 1);
      intersection.push(elemA);
    });
    return intersection;
  }
}
