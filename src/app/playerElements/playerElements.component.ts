import {Component, Input, OnInit} from '@angular/core';
import {Element} from "../shared/element";

@Component({
  selector: 'app-elements',
  templateUrl: './playerElements.component.html',
  styleUrls: ['./playerElements.component.css']
})
export class PlayerElementsComponent implements OnInit {

  @Input() elements!: Element[];

  constructor() { }

  ngOnInit(): void {
  }

}
