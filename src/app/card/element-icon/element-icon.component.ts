import {Component, Input, OnInit} from '@angular/core';
import {Element} from "../../shared/models/element";
import {ElementType} from "../../shared/enums/element-type";

@Component({
  selector: 'app-element-icon',
  templateUrl: './element-icon.component.html',
  styleUrls: ['./element-icon.component.css']
})
export class ElementIconComponent {

  @Input() element!: Element;

  elementals: ElementType[] = [ElementType.WOOD, ElementType.FIRE, ElementType.OCEAN, ElementType.STORM,
    ElementType.DAWN, ElementType.SHADOW];

  constructor() { }
}
