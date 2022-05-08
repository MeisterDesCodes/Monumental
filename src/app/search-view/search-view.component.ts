import {Component} from '@angular/core';
import {Card, GreenLair, SP} from "../shared/card";
import {GamestateHandler} from "../services/gamestate-handler";
import {GamestateType} from "../shared/enums/gamestate-type";
import {CardHandler} from "../services/card-handler";
import {CardAction} from "../shared/enums/card-action";

@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.css']
})
export class SearchViewComponent {

  cards: Card[] = [new GreenLair(), new GreenLair(), new GreenLair(), new GreenLair(), new GreenLair(),
    new GreenLair(), new GreenLair(), new GreenLair(), new GreenLair(), new GreenLair()]

  constructor(private gamestateHandler: GamestateHandler, private cardHandler: CardHandler) { }

  getCards(): Card[] | null {
    return this.cardHandler.getActiveSearchCards();
  }

  isSearchActive(): boolean {
    return this.gamestateHandler.isValidGamestate([GamestateType.SEARCH]);
  }

  selectCard(card: Card): void {
    switch (this.cardHandler.getActiveSearchCardsAction()) {
      case CardAction.DRAW:
        this.cardHandler.addCardFromDeckToHand(card);
        break;
      case CardAction.DESTROY:
        this.cardHandler.sendCardFromFieldToGraveyard(card);
        break;
      case CardAction.DISCARD:
        this.cardHandler.discardCard(card);
        break;
      case CardAction.SUMMON:
        this.cardHandler.addCardFromGraveyardToField(card);
        break;
    }
    this.cardHandler.setActiveSearchCardsCount(this.cardHandler.getActiveSearchCardsCount() - 1);
    if (this.cardHandler.getActiveSearchCardsCount() >= 1) {
      let cards: Card[] = this.cardHandler.getActiveSearchCards()!;
      cards.splice(cards.indexOf(card), 1);
    }
    else {
      if (this.cardHandler.getActiveSearchCardsAction() === CardAction.SUMMON) {
        this.resetState();
        this.gamestateHandler.setGamestate(GamestateType.SUMMON);
      }
      else {
        this.resetState();
      }
      this.cardHandler.setSelectedSearchCards([card]);
      if (SP.getCardHandler().chain.length > 0) {
        this.cardHandler.chain.pop()!();
      }
    }
  }

  resetState(): void {
    this.cardHandler.setActiveSearchCards(null);
    this.cardHandler.setActiveSearchCardsAction(null);
    this.cardHandler.setActiveSearchCardsCount(0);
    this.gamestateHandler.setGamestate(GamestateType.NORMAL);
  }

  canExitSearchView(): boolean {
    return this.cardHandler.getActiveSearchCards()!.length === 0 ||
      this.cardHandler.getActiveSearchCardsAction() === CardAction.DRAW;
  }
}
