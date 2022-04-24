import {Component, Input, OnInit} from '@angular/core';
import {Player} from "../../shared/player";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent {

  @Input() player!: Player;

  constructor() { }
}
