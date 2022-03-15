import {Component, OnInit} from '@angular/core';
import {CardType} from "../shared/card-type";

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {

  rowSize: number = 5;
  rowTypes: CardType[] = [CardType.UNIT, CardType.BUILDING, CardType.MONUMENT];

  constructor() { }

  ngOnInit(): void {
  }

}
