import {Component, Input, OnInit} from '@angular/core';
import {Card} from '../shared/card';
import VanillaTilt from "vanilla-tilt";
import {CardType} from "../shared/enums/card-type";
import {CardHandler} from "../services/card-handler";
import {DetailsHandler} from "../services/details-handler";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() card!: Card;
  @Input() isDetail!: boolean;

  constructor(private cardHandler: CardHandler, private detailsHandler: DetailsHandler) { }

  ngOnInit(): void {
    VanillaTilt.init(document.querySelectorAll('.game-card') as any);
  }

  isUnit(card: Card): boolean {
    return card.type === CardType.UNIT;
  }

  getSelectedCard(): Card | null {
    return this.cardHandler.getSelectedCard();
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
    this.detailsHandler.setCurrentCard(this.card);
  }
}
