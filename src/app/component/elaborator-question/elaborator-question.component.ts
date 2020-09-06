import {
  Component,
  ChangeDetectionStrategy,
  HostBinding,
  Input,
  ViewEncapsulation,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { Question, Answer } from '../elaborator-question.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigService } from '../../service';

@Component({
  selector: 'sk-elaborator-question',
  templateUrl: './elaborator-question.component.html',
  styleUrls: ['./elaborator-question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ElaboratorQuestionComponent {
  @HostBinding('class.elaborator-question') hostCss = true;

  @Input()
  question: Question;

  @Input()
  currentQuestionNumber = 1;

  @Output()
  nextQuestionClick = new EventEmitter<Answer>();

  readonly maxQuestionCount;

  private selectedAnswerId: string | undefined;

  constructor(private snackBar: MatSnackBar, configService: ConfigService) {
    this.maxQuestionCount = configService.getMaxQuestionsCount();
  }

  onSelect(change: MatRadioChange) {
    this.selectedAnswerId = change.value;
  }

  onNextClick() {
    if (this.selectedAnswerId) {
      this.nextQuestionClick.emit();
      return;
    }
    this.snackBar.open('Select an answer please', 'OK', {
      duration: 2000,
    });
  }
}
