import {Component} from '@angular/core';
import {Card, VerdantLair} from "../shared/card";
import {GamestateHandler} from "../services/gamestate-handler";
import {GamestateType} from "../shared/gamestate-type";
import {CardHandler} from "../services/card-handler";
import {CardAction} from "../shared/card-action";

@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.css']
})
export class SearchViewComponent {

  cards: Card[] = [new VerdantLair(), new VerdantLair(), new VerdantLair(), new VerdantLair(), new VerdantLair(),
    new VerdantLair(), new VerdantLair(), new VerdantLair(), new VerdantLair(), new VerdantLair()]

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
    }
    this.cardHandler.setActiveSearchCards(null);
    this.cardHandler.setActiveSearchCardsAction(null);
    this.gamestateHandler.setGamestate(GamestateType.NORMAL);
  }
}
