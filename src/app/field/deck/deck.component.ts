import {Component, Input} from '@angular/core';
import {Player} from "../../shared/player";
import {Card} from "../../shared/card";
import {CardHandler} from "../../services/card-handler";

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})
export class DeckComponent {

  @Input() player!: Player;

  constructor(private cardHandler: CardHandler) {
  }

  setSelectedCard(card: Card) {
    this.cardHandler.setSelectedCard(card);
  }

  getSelectedCard(): Card | null {
    return this.cardHandler.getSelectedCard();
  }

  isDeckEmpty(): boolean {
    return this.player.deck.cards.length === 0;
  }

  getTopDeckCard(): Card {
    return this.player.deck.cards[this.player.deck.cards.length - 1];
  }
}
