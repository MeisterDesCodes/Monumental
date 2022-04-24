import {Component, Input, OnInit} from '@angular/core';
import {CardType} from "../shared/card-type";
import {Player} from "../shared/player";

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent {

  @Input() player!: Player;
  @Input() order!: number;

  rowSize: number = 5;
  rowTypes: CardType[] = [CardType.UNIT, CardType.BUILDING, CardType.MONUMENT];

  constructor() {}
}
