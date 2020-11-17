import {
  Component,
  ChangeDetectionStrategy,
  HostBinding,
  OnInit,
  ChangeDetectorRef,
  ViewEncapsulation,
  OnDestroy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Subscription } from 'rxjs';
import { Question, SelectedAndRightAnswer } from '../elaborator-question.model';
import { AppState } from '../../app.module';
import { tap, take, filter } from 'rxjs/operators';
import { getQuestions, getSelectedAndRightAnswers, getScore } from '../..';
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
export class ElaboratorReviewLobbyComponent implements OnInit, OnDestroy {
  @HostBinding('class.elaborator-review-lobby') hostCss = true;

  questions: Question[];
  score: number;
  selectedAndRightAnswersMap: Map<
    string,
    SelectedAndRightAnswer & { answerSummaryState: AnswerSummaryState }
  >;
  questionPreview: false;
  isLoading = true;

  answerSummaryState = AnswerSummaryState;

  private data$$: Subscription | undefined;

  constructor(
    private store: Store<AppState>,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.data$$ = combineLatest([
      this.store.select(getSelectedAndRightAnswers),
      this.store.select(getScore),
      this.store.select(getQuestions),
    ])
      .pipe(
        tap(([, , questions]) => {
          // TODO if not in store yet, query from vackend
          if (!questions?.length) {
            this.router.navigate(['']);
          }
        }),
        filter(
          ([selectedAndRightAnswers, , questions]) =>
            !!selectedAndRightAnswers?.length && !!questions?.length
        )
      )
      .subscribe(
        ([selectedAndRightAnswers, score, questions]: [
          SelectedAndRightAnswer[],
          number,
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
          this.score = score;
          this.isLoading = false;
          this.cdRef.markForCheck();
        }
      );
  }

  ngOnDestroy() {
    this.data$$?.unsubscribe();
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
