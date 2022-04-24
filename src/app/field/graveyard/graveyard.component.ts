import {Component, Input} from '@angular/core';
import {Player} from "../../shared/player";
import {Card} from "../../shared/card";

@Component({
  selector: 'app-graveyard',
  templateUrl: './graveyard.component.html',
  styleUrls: ['./graveyard.component.css']
})
export class GraveyardComponent {

  @Input() player!: Player;

  constructor() {
  }

  isGraveyardEmpty(): boolean {
    return this.player.graveyard.cards.length === 0;
  }

  getLastGraveyardCard(): Card {
    return this.player.graveyard.cards[this.player.graveyard.cards.length - 1];
  }
}
