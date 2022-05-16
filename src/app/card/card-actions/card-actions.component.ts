import {Component, Input} from '@angular/core';
import {Card} from "../../shared/card";
import {CardAction} from "../../shared/enums/card-action";
import {CardHandler} from "../../services/card-handler";
import {PlayerHandler} from "../../services/player-handler";
import {CardLocation} from "../../shared/enums/card-location";
import {SearchHandler} from "../../services/search-handler";

@Component({
  selector: 'app-card-actions',
  templateUrl: './card-actions.component.html',
  styleUrls: ['./card-actions.component.css']
})
export class CardActionsComponent {

  @Input() card!: Card;

  constructor(private gameLogic: CardHandler, private playerHandler: PlayerHandler,
              private searchHandler: SearchHandler) { }

  getPerformableActions(): CardAction[] {
    if (this.card) {
      let cardActions: CardAction[] = this.card.cardActions.filter(
        cardAction => this.canPerformAction(cardAction));
      if (this.card.location === CardLocation.GRAVEYARD) {
        cardActions.push(CardAction.VIEW_GRAVEYARD);
      }
      if (this.card.location === CardLocation.DECK) {
        cardActions.push(CardAction.VIEW_DECK);
      }
      return cardActions;
    }
    else {
      return [];
    }
  }

  canPerformAction(action: CardAction): boolean {
    if (this.card.owner === this.playerHandler.getCurrentPlayer()) {
      switch (action) {
        case CardAction.SUMMON:
          return this.gameLogic.canSummonCard(this.card);
        case CardAction.PLACE:
          return this.gameLogic.canPlaceCard(this.card);
        case CardAction.DISCARD:
          return this.gameLogic.canDiscardCard(this.card);
        case CardAction.ACTIVATE:
          return this.gameLogic.canActivateCard(this.card);
        case CardAction.ATTACK:
          return this.gameLogic.canAttack(this.card);
        default:
          return false;
      }
    }
    else {
      return false;
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
      case CardAction.ATTACK:
        this.gameLogic.showAttackOptions(card);
        break;
      case CardAction.VIEW_GRAVEYARD:
        this.searchHandler.viewCards(card.owner, CardLocation.GRAVEYARD);
        break;
      case CardAction.VIEW_DECK:
        this.searchHandler.viewCards(card.owner, CardLocation.DECK);
        break;
    }
  }
}
