import {Archetype} from "../shared/archetype";
import {Card} from "../shared/card";
import {CardLocation} from "../shared/card-location";
import {Player} from "../shared/player";
import {SearchViewComponent} from "../search-view/search-view.component";
import {GamestateHandler} from "./gamestate-handler";
import {GamestateType} from "../shared/gamestate-type";
import {Injectable} from "@angular/core";
import {CardHandler} from "./card-handler";
import {CardAction} from "../shared/card-action";

@Injectable()
export class SearchHandler {

  constructor(private searchViewComponent: SearchViewComponent, private gamestateHandler: GamestateHandler,
              private cardHandler: CardHandler) {
  }

  getCards(player: Player, location: CardLocation): Card[] {
    switch (location) {
      case CardLocation.DECK:
        return player.deck.cards;
      case CardLocation.HAND:
        return player.hand.cards;
      case CardLocation.FIELD:
        return player.field.cards;
      case CardLocation.GRAVEYARD:
        return player.graveyard.cards;
    }
  }

  drawCardsByArchetype(player: Player, location: CardLocation, archetype: Archetype) {
    this.cardHandler.setActiveSearchCardsAction(CardAction.DRAW);
    this.searchCardsByArchetype(player, location, archetype);
  }

  searchCardsByArchetype(player: Player, location: CardLocation, archetype: Archetype): void {
    let cards: Card[] = this.getCards(player, location).filter(card => card.archetype === archetype);
    this.cardHandler.setActiveSearchCards(cards);
    this.gamestateHandler.setGamestate(GamestateType.SEARCH);
  }
}
