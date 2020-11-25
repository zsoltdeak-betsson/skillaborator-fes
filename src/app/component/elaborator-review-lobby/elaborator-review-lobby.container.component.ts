import {
  Component,
  ChangeDetectionStrategy,
  HostBinding,
  OnInit,
  ChangeDetectorRef,
  ViewEncapsulation,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Subscription } from 'rxjs';
import { Question, SelectedAndRightAnswer } from '../elaborator-question.model';
import { AppState } from '../../app.module';
import { tap, filter } from 'rxjs/operators';
import {
  getQuestions,
  getSelectedAndRightAnswers,
  getScore,
} from '../../state';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';

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
  @HostBinding('class.elaborator-review-lobby-responsive') responsiveCss = true;

  @ViewChild('scoreChart') set scoreChart(scoreChart: ElementRef) {
    this._scoreChart = scoreChart;
    if (scoreChart) {
      this.loadScoreChart();
    }
  }

  questions: Question[];
  score: number;
  selectedAndRightAnswersMap: Map<
    string,
    SelectedAndRightAnswer & { answerSummaryState: AnswerSummaryState }
  >;
  questionPreview: false;
  isLoading = true;

  isBeginner = false;
  isMedior = false;
  isPro = false;

  answerSummaryState = AnswerSummaryState;

  private data$$: Subscription | undefined;
  private _scoreChart: ElementRef | undefined;
  private chart: Chart | undefined;

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
          // TODO if not in store yet, query from backend
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

          this.isBeginner = score < 120;
          this.isMedior = score < 200 && !this.isBeginner;
          this.isPro = !this.isBeginner && !this.isMedior;

          this.cdRef.markForCheck();
        }
      );
  }

  ngOnDestroy() {
    this.data$$?.unsubscribe();
    this.chart?.destroy();
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

  private loadScoreChart() {
    // prettier-ignore
    // 1/(20*sqrt(2*pi))*e^(-1/2*((x-180)/30)^2)*10^4
    const labels = ['0', '20', '40', '60', '80', '100', '120', '140', '160', '180', '200', '220', '240', '260', '280'];
    // prettier-ignore
    const data: Chart.ChartData = {
      labels,
      datasets: [
        {
          data: [0, 0.00013, 0.003, 0.067, 0.77, 5.7, 27, 82, 159, 199.5, 159, 82, 27, 5.7, 0.77, 0.067],
          radius: (context) => {
            const index = context.dataIndex;
            const xValue = Number(labels[index]);
            if (Math.abs(this.score - xValue) <= 10){
              return 4;
            }
            return 0;
          }
        },
      ],
    };
    // score chart
    const ctx = this._scoreChart.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data,
      options: {
        legend: { display: false },
        scales: {
          yAxes: [{ display: false }],
          xAxes: [
            {
              gridLines: { drawOnChartArea: false },
            },
          ],
        },
        elements: {
          point: { backgroundColor: 'green' },
        },
        tooltips: { enabled: false },
        hover: { mode: null },
      },
    });
  }
}
