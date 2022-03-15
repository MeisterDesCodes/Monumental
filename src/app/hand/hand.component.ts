import {Component, Input, OnInit} from '@angular/core';
import {Hand} from "../shared/hand";
import {Card} from "../shared/card";

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.css']
})
export class HandComponent {

  @Input() hand!: Hand;

  selectedCard: Card | null = null;

  constructor() { }

  selectCard(card: Card) {
    this.selectedCard === card ? this.selectedCard = null : this.selectedCard = card;
  }
}
