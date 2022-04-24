import {Component, Input, OnInit} from '@angular/core';
import {Element} from "../../shared/element";

@Component({
  selector: 'app-elements',
  templateUrl: './player-elements.component.html',
  styleUrls: ['./player-elements.component.css']
})
export class PlayerElementsComponent {

  @Input() elements!: Element[];

  constructor() { }
}
