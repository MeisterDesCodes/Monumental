import {Archetype} from "../shared/enums/archetype";
import {Card} from "../shared/card";
import {CardLocation} from "../shared/enums/card-location";
import {Player} from "../shared/player";
import {SearchViewComponent} from "../search-view/search-view.component";
import {GamestateHandler} from "./gamestate-handler";
import {GamestateType} from "../shared/enums/gamestate-type";
import {Injectable} from "@angular/core";
import {CardHandler} from "./card-handler";
import {CardAction} from "../shared/enums/card-action";
import {CardType} from "../shared/enums/card-type";

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
    this.gamestateHandler.setGamestate(GamestateType.SEARCH);
    this.cardHandler.setActiveSearchCardsAction(CardAction.DRAW);
    this.cardHandler.setActiveSearchCards(
      this.getCards(player, location).filter(card => card.archetype === archetype));
  }

  drawCardsByArchetypeAndType(player: Player, location: CardLocation, archetype: Archetype, cardType: CardType) {
    this.gamestateHandler.setGamestate(GamestateType.SEARCH);
    this.cardHandler.setActiveSearchCardsAction(CardAction.DRAW);
    this.cardHandler.setActiveSearchCards(
      this.getCards(player, location).filter(card => card.archetype === archetype && card.type === cardType));
    console.log(this.getCards(player, location).filter(card => card.archetype === archetype && card.type === cardType));
  }
}
