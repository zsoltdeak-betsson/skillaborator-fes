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
import { getCurrentQuestion, ElaboratorAction } from 'src/app/state';
import { Subscription } from 'rxjs';
import { Question } from '../elaborator-question.model';
import { AppState } from 'src/app/app.module';

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
  question$$ = new Subscription();

  constructor(
    private store: Store<AppState>,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.store.dispatch(ElaboratorAction.getQuestion());
    this.question$$.add(
      this.store.select(getCurrentQuestion).subscribe((question: Question) => {
        this.question = question;
        this.cdRef.markForCheck();
      })
    );
  }

  ngOnDestroy() {
    this.question$$.unsubscribe();
  }
}
