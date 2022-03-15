import {Component, Input, OnInit} from '@angular/core';
import {Element} from "../../shared/element";
import {ElementType} from "../../shared/element-type";

@Component({
  selector: 'app-element-icon',
  templateUrl: './element-icon.component.html',
  styleUrls: ['./element-icon.component.css']
})
export class ElementIconComponent implements OnInit {

  @Input() element!: Element;

  elementals: ElementType[] = [ElementType.WOOD, ElementType.FIRE, ElementType.OCEAN, ElementType.STORM,
    ElementType.SHADOW, ElementType.DAWN];

  constructor() { }

  ngOnInit(): void {
  }

}
