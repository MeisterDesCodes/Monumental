import {Component, Input, OnInit} from '@angular/core';
import {Card} from '../shared/card';
import VanillaTilt from "vanilla-tilt";
import {CardType} from "../shared/enums/card-type";
import {CardHandler} from "../services/card-handler";
import {DetailsHandler} from "../services/details-handler";
import {CardLocation} from "../shared/enums/card-location";
import {PlayerHandler} from "../services/player-handler";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() card!: Card;
  @Input() isDetail!: boolean;

  constructor(private cardHandler: CardHandler, private detailsHandler: DetailsHandler,
              private playerHandler: PlayerHandler) { }

  ngOnInit(): void {
    VanillaTilt.init(document.querySelectorAll('.game-card') as any);
  }

  isHigherAttack(): boolean {
    return this.card.attack > this.card.originalAttack;
  }

  isLowerAttack(): boolean {
    return this.card.attack < this.card.originalAttack;
  }

  isHigherHealth(): boolean {
    return this.card.remainingHealth > this.card.originalHealth;
  }

  isLowerHealth(): boolean {
    return this.card.remainingHealth < this.card.originalHealth;
  }

  setCurrentCard(): void {
    if (this.card.location !== CardLocation.DECK) {
      this.detailsHandler.setCurrentCard(this.card);
    }
  }

  isUnit(): boolean {
    return this.card.type === CardType.UNIT;
  }

  isBuilding(): boolean {
    return this.card.type === CardType.BUILDING;
  }

  isSpell(): boolean {
    return this.card.type === CardType.SPELL;
  }

  isMonument(): boolean {
    return this.card.type === CardType.MONUMENT;
  }

  showCardActions() {
    return this.card === this.cardHandler.getSelectedCard() && !this.isDetail &&
      this.card.owner === this.playerHandler.getCurrentPlayer();
  }
}
