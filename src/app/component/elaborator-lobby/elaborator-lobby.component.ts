import { Component, OnInit, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { Answer } from '../elaborator-lobby.model';

@Component({
  selector: 'sk-elaborator-lobby',
  templateUrl: './elaborator-lobby.component.html',
  styleUrls: ['./elaborator-lobby.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElaboratorLobbyComponent implements OnInit {
  @HostBinding('class.elaborator-lobby') someField = true;
  // questions and answers both got from store
  answers: Answer[] = [];

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
