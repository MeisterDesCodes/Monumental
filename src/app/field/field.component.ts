import {Component, Input, OnInit} from '@angular/core';
import {CardType} from "../shared/enums/card-type";
import {Player} from "../shared/player";
import {CardSlotComponent} from "./card-slot/card-slot.component";

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
