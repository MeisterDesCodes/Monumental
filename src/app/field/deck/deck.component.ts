import {Component, Input} from '@angular/core';
import {Player} from "../../shared/player";

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})
export class DeckComponent {

  @Input() player!: Player;

  constructor() {
  }

  isDeckEmpty(): boolean {
    return this.player.deck.cards.length === 0;
  }
}
