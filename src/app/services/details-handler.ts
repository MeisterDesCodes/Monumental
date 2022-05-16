import {Injectable} from "@angular/core";
import {SearchViewComponent} from "../search-view/search-view.component";
import {GamestateHandler} from "./gamestate-handler";
import {CardHandler} from "./card-handler";
import {PlayerHandler} from "./player-handler";
import {BlankCard, Card} from "../shared/card";

@Injectable()
export class DetailsHandler {

  constructor() {
  }

  currentCard: Card = new BlankCard();

  setCurrentCard(card: Card): void {
    this.currentCard = card;
  }

  getCurrentCard(): Card {
    return this.currentCard;
  }
}
