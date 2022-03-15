import {Component, Input, OnInit} from '@angular/core';
import {Card} from "../../shared/card";
import {GamestateHandler} from "../../services/gamestate-handler";
import {GamestateType} from "../../shared/gamestate-type";
import {CardHandler} from "../../services/card-handler";
import {CardAction} from "../../shared/card-action";
import {CardType} from "../../shared/card-type";

@Component({
  selector: 'app-card-slot',
  templateUrl: './card-slot.component.html',
  styleUrls: ['./card-slot.component.css']
})
export class CardSlotComponent {

  @Input() card!: Card;
  @Input() rowType!: CardType;

  constructor(private gamestateHandler: GamestateHandler, private cardHandler: CardHandler) { }

  performAction(): void {
    let activeCard = this.cardHandler.getActiveCard();
    let activeCardAction = this.cardHandler.getActiveCardAction();
    if (activeCard && activeCardAction) {
      switch (activeCardAction) {
        case CardAction.SUMMON:
          this.cardHandler.summonCard(activeCard);
          break;
        case CardAction.PLACE:
          this.cardHandler.placeCard(activeCard);
          break;
      }
      this.cardHandler.payElementCost(activeCard);
      this.card = activeCard;
    }
    this.cardHandler.setActiveCard(null);
    this.cardHandler.setActiveCardAction(null);
    this.gamestateHandler.setGamestate(GamestateType.NORMAL);
  }

  isUsable(): boolean {
    return !this.card &&
      this.gamestateHandler.isValidGamestate([GamestateType.SUMMON, GamestateType.PLACE]) &&
      this.rowType === this.cardHandler.getActiveCard()!.type;
  }
}
