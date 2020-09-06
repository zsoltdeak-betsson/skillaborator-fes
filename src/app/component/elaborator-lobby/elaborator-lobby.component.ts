import {
  Component,
  ChangeDetectionStrategy,
  HostBinding,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewEncapsulation,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  getCurrentQuestion,
  ElaboratorAction,
  getLoadingCurrentQuestion,
} from 'src/app/state';
import { Subscription } from 'rxjs';
import { Question } from '../elaborator-question.model';
import { AppState } from './../../app.module';
import {
  LocalStorageService,
  QUESTION_IDS_STORAGE_KEY,
  ANSWER_IDS_STORAGE_KEY,
} from './../../service';

@Component({
  selector: 'sk-elaborator-lobby',
  templateUrl: './elaborator-lobby.component.html',
  styleUrls: ['./elaborator-lobby.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ElaboratorLobbyComponent implements OnInit, OnDestroy {
  @HostBinding('class.elaborator-lobby') hostCss = true;

  question: Question | undefined;
  subscription$$ = new Subscription();
  isLoadingQuestion = true;
  currentQuestionNumber = 1;

  constructor(
    private store: Store<AppState>,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    LocalStorageService.setForKey(QUESTION_IDS_STORAGE_KEY, []);
    LocalStorageService.setForKey(ANSWER_IDS_STORAGE_KEY, []);

    this.store.dispatch(ElaboratorAction.getQuestion());
    this.subscription$$.add(
      this.store.select(getCurrentQuestion).subscribe((question: Question) => {
        this.question = question;
        this.cdRef.markForCheck();
      })
    );

    this.subscription$$.add(
      this.store
        .select(getLoadingCurrentQuestion)
        .subscribe((isLoading: boolean) => {
          this.isLoadingQuestion = isLoading;
          this.cdRef.markForCheck();
        })
    );
  }

  ngOnDestroy() {
    this.subscription$$.unsubscribe();
  }

  getNextQuestion(selectedAnswerId: string) {
    const previousQuestionIds =
      LocalStorageService.getForKey(QUESTION_IDS_STORAGE_KEY) ?? [];
    const previousAnswerIds =
      LocalStorageService.getForKey(ANSWER_IDS_STORAGE_KEY) ?? [];

    previousQuestionIds.push(this.question.id);
    previousAnswerIds.push(selectedAnswerId);

    LocalStorageService.setForKey(
      QUESTION_IDS_STORAGE_KEY,
      previousQuestionIds
    );
    LocalStorageService.setForKey(ANSWER_IDS_STORAGE_KEY, previousAnswerIds);

    this.currentQuestionNumber = previousAnswerIds.length + 1;

    this.store.dispatch(ElaboratorAction.getQuestion());
  }
}
