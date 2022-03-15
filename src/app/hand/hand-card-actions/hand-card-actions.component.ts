import {Component, Input, OnInit} from '@angular/core';
import {Card} from "../../shared/card";
import {CardAction} from "../../shared/card-action";
import {CardHandler} from "../../services/card-handler";

@Component({
  selector: 'app-hand-card-actions',
  templateUrl: './hand-card-actions.component.html',
  styleUrls: ['./hand-card-actions.component.css']
})
export class HandCardActionsComponent {

  @Input() card!: Card;

  constructor(private gameLogic: CardHandler) { }

  getPerformableActions() {
    return this.card.cardActions.filter(cardAction => this.canPerformAction(cardAction));
  }

  canPerformAction(action: CardAction): boolean {
    switch (action) {
      case CardAction.SUMMON:
        return this.gameLogic.canSummonCard(this.card);
      case CardAction.PLACE:
        return this.gameLogic.canPlaceCard(this.card);
      case CardAction.DISCARD:
        return this.gameLogic.canDiscardCard(this.card);
      case CardAction.ACTIVATE:
        return this.gameLogic.canActivateCard(this.card);
    }
  }

  performAction(card: Card, action: CardAction): void {
    switch (action) {
      case CardAction.SUMMON:
        this.gameLogic.showCardSummonOptions(card);
        break;
      case CardAction.PLACE:
        this.gameLogic.showCardPlaceOptions(card);
        break;
      case CardAction.ACTIVATE:
        this.gameLogic.activateCard(card);
        break;
      case CardAction.DISCARD:
        this.gameLogic.discardCard(card);
        break;
    }
  }
}
