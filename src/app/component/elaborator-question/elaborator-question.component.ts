import { Component, OnInit, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { Answer, Question } from '../elaborator-question.model';

const answers: Answer[] = [
  { id: "0", value: "Answer1" },
  { id: "1", value: "Answer2" },
  { id: "2", value: "Answer2" },
  {
    id: "3", value: `Answer
4 long multiline answer`
  }
];

@Component({
  selector: 'sk-elaborator-question',
  templateUrl: './elaborator-question.component.html',
  styleUrls: ['./elaborator-question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElaboratorQuestionComponent implements OnInit {
  @HostBinding('class.elaborator-question') hostCss = true;
  // questions and answers both got from store
  question: Question = {
    answers,
    id: "0",
    level: 1,
    value: "What is the difference between var and let?"
  };

  private selectedAnswer = '';

  constructor() {
  }

  ngOnInit(): void {
    // TODO
  }

  onSelect(change: MatRadioChange) {
    this.selectedAnswer = change.value;
  }
}
