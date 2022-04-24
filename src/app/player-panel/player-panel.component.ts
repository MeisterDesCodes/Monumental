import {Component, Input, OnInit} from '@angular/core';
import {Player} from "../shared/player";

@Component({
  selector: 'app-player-panel',
  templateUrl: './player-panel.component.html',
  styleUrls: ['./player-panel.component.css']
})
export class PlayerPanelComponent {

  @Input() player!: Player;

  constructor() { }
}
