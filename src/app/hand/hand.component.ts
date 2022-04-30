import {Component, Input, OnInit} from '@angular/core';
import {Hand} from "../shared/models/hand";
import {Card} from "../shared/card";
import {CardHandler} from "../services/card-handler";

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.css']
})
export class HandComponent {

  @Input() hand!: Hand;

  constructor(private cardHandler: CardHandler) { }

  setSelectedCard(card: Card) {
    this.getSelectedCard() !== card ? this.cardHandler.setSelectedCard(card) :
      this.cardHandler.setSelectedCard(null);
  }

  getSelectedCard(): Card | null {
    return this.cardHandler.getSelectedCard();
  }
}
