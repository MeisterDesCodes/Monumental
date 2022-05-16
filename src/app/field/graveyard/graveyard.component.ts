import {Component, Input} from '@angular/core';
import {Player} from "../../shared/player";
import {Card} from "../../shared/card";
import {CardHandler} from "../../services/card-handler";

@Component({
  selector: 'app-graveyard',
  templateUrl: './graveyard.component.html',
  styleUrls: ['./graveyard.component.css']
})
export class GraveyardComponent {

  @Input() player!: Player;

  constructor(private cardHandler: CardHandler) {
  }

  setSelectedCard(card: Card) {
    this.cardHandler.setSelectedCard(card);
  }

  getSelectedCard(): Card | null {
    return this.cardHandler.getSelectedCard();
  }

  isGraveyardEmpty(): boolean {
    return this.player.graveyard.cards.length === 0;
  }

  getLastGraveyardCard(): Card {
    return this.player.graveyard.cards[this.player.graveyard.cards.length - 1];
  }
}
