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
import {PlayerHandler} from "./player-handler";
import {ElementType} from "../shared/enums/element-type";

@Injectable()
export class SearchHandler {

  constructor(private searchViewComponent: SearchViewComponent, private gamestateHandler: GamestateHandler,
              private cardHandler: CardHandler, private playerHandler: PlayerHandler) {
  }

  getCards(player: Player | null, location: CardLocation): Card[] {
    switch (location) {
      case CardLocation.DECK:
        return player ? player.deck.cards : this.playerHandler.getCurrentPlayer().deck.cards.concat(
          this.playerHandler.getEnemyPlayer().deck.cards);
      case CardLocation.HAND:
        return player ? player.hand.cards : this.playerHandler.getCurrentPlayer().hand.cards.concat(
          this.playerHandler.getEnemyPlayer().hand.cards);
      case CardLocation.FIELD:
        return player ? player.field.cards : this.playerHandler.getCurrentPlayer().field.cards.concat(
          this.playerHandler.getEnemyPlayer().field.cards);
      case CardLocation.GRAVEYARD:
        return player ? player.graveyard.cards : this.playerHandler.getCurrentPlayer().graveyard.cards.concat(
          this.playerHandler.getEnemyPlayer().graveyard.cards);
    }
  }

  drawCards(player: Player, cardLocation: CardLocation, count: number) {
    this.gamestateHandler.setGamestate(GamestateType.SEARCH);
    this.cardHandler.setActiveSearchCardsAction(CardAction.DRAW);
    this.cardHandler.setActiveSearchCards(this.getCards(player, cardLocation));
    this.cardHandler.setActiveSearchCardsCount(count);
  }

  drawCardsByArchetype(player: Player, cardLocation: CardLocation, archetype: Archetype, count: number) {
    this.gamestateHandler.setGamestate(GamestateType.SEARCH);
    this.cardHandler.setActiveSearchCardsAction(CardAction.DRAW);
    this.cardHandler.setActiveSearchCards(
      this.getCards(player, cardLocation).filter(card => card.archetype === archetype));
    this.cardHandler.setActiveSearchCardsCount(count);
  }

  drawCardsByArchetypeAndName(player: Player, cardLocation: CardLocation, archetype: Archetype, name: string,
                              count: number) {
    this.gamestateHandler.setGamestate(GamestateType.SEARCH);
    this.cardHandler.setActiveSearchCardsAction(CardAction.DRAW);
    this.cardHandler.setActiveSearchCards(
      this.getCards(player, cardLocation).filter(
        card => card.archetype === archetype && card.name.toLowerCase().includes(name.toLowerCase())));
    this.cardHandler.setActiveSearchCardsCount(count);
  }

  drawCardsByArchetypeAndType(player: Player, cardLocation: CardLocation, archetype: Archetype, cardType: CardType,
                              count: number) {
    this.gamestateHandler.setGamestate(GamestateType.SEARCH);
    this.cardHandler.setActiveSearchCardsAction(CardAction.DRAW);
    this.cardHandler.setActiveSearchCards(
      this.getCards(player, cardLocation)
        .filter(card => card.archetype === archetype && card.type === cardType));
    this.cardHandler.setActiveSearchCardsCount(count);
  }

  destroyCardsByPlayerAndType(player: Player, cardLocation: CardLocation, cardType: CardType, count: number): void {
    this.gamestateHandler.setGamestate(GamestateType.SEARCH);
    this.cardHandler.setActiveSearchCardsAction(CardAction.DESTROY);
    this.cardHandler.setActiveSearchCards(
      this.getCards(player, cardLocation).filter(card => card.type === cardType));
    this.cardHandler.setActiveSearchCardsCount(count);
  }

  destroyCardsByPlayerAndTypeAndArchetype(player: Player, cardLocation: CardLocation, cardType: CardType,
                                          archetype: Archetype, count: number): void {
    this.gamestateHandler.setGamestate(GamestateType.SEARCH);
    this.cardHandler.setActiveSearchCardsAction(CardAction.DESTROY);
    this.cardHandler.setActiveSearchCards(
      this.getCards(player, cardLocation).filter(
        card => card.type === cardType && card.archetype === archetype));
    this.cardHandler.setActiveSearchCardsCount(count);
  }

  destroyCardsByPlayer(player: Player, cardLocation: CardLocation, count: number): void {
    this.gamestateHandler.setGamestate(GamestateType.SEARCH);
    this.cardHandler.setActiveSearchCardsAction(CardAction.DESTROY);
    this.cardHandler.setActiveSearchCards(this.getCards(player, cardLocation));
    this.cardHandler.setActiveSearchCardsCount(count);
  }

  destroyCards(player: Player, cardLocation: CardLocation, count: number): void {
    this.gamestateHandler.setGamestate(GamestateType.SEARCH);
    this.cardHandler.setActiveSearchCardsAction(CardAction.DESTROY);
    this.cardHandler.setActiveSearchCards(this.getCards(null, cardLocation));
    this.cardHandler.setActiveSearchCardsCount(count);
  }

  discardCards(player: Player, cardLocation: CardLocation, count: number): void {
    this.gamestateHandler.setGamestate(GamestateType.SEARCH);
    this.cardHandler.setActiveSearchCardsAction(CardAction.DISCARD);
    this.cardHandler.setActiveSearchCards(this.getCards(player, cardLocation));
    this.cardHandler.setActiveSearchCardsCount(count);
  }

  discardCardsByArchetype(player: Player, cardLocation: CardLocation, archetype: Archetype, count: number): void {
    this.gamestateHandler.setGamestate(GamestateType.SEARCH);
    this.cardHandler.setActiveSearchCardsAction(CardAction.DISCARD);
    this.cardHandler.setActiveSearchCards(
      this.getCards(player, cardLocation).filter(card => card.archetype === archetype));
    this.cardHandler.setActiveSearchCardsCount(count);
  }

  destroyCardsByPlayerWoodAmount(player: Player, cardLocation: CardLocation, count: number): void {
    this.gamestateHandler.setGamestate(GamestateType.SEARCH);
    this.cardHandler.setActiveSearchCardsAction(CardAction.DESTROY);
    this.cardHandler.setActiveSearchCards(
      this.getCards(player, cardLocation).filter(card => card.remainingHealth <
        this.playerHandler.getElement(this.playerHandler.getCurrentPlayer(), ElementType.WOOD).amount));
    this.cardHandler.setActiveSearchCardsCount(count);
  }

  summonCardsByArchetypeAndHealth(player: Player, cardLocation: CardLocation, archetype: Archetype, health: number,
                                  count: number): void {
    this.gamestateHandler.setGamestate(GamestateType.SEARCH);
    this.cardHandler.setActiveSearchCardsAction(CardAction.SUMMON);
    this.cardHandler.setActiveSearchCards(
      this.getCards(player, cardLocation).filter(card => card.archetype === archetype &&
        card.maxHealth <= health));
    this.cardHandler.setActiveSearchCardsCount(count);
  }
}
