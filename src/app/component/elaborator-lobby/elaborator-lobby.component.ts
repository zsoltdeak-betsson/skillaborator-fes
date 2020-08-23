import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';


@Component({
  selector: 'sk-elaborator-lobby',
  templateUrl: './elaborator-lobby.component.html',
  styleUrls: ['./elaborator-lobby.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElaboratorLobbyComponent {
  @HostBinding('class.elaborator-lobby') hostCss = true;
}
