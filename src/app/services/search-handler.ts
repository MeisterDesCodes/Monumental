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

@Injectable()
export class SearchHandler {

  constructor(private searchViewComponent: SearchViewComponent, private gamestateHandler: GamestateHandler,
              private cardHandler: CardHandler, private playerHandler: PlayerHandler) {
  }

  getCards(player: Player | null, location: CardLocation): Card[] {
    this.gamestateHandler.setGamestate(GamestateType.SEARCH);
    this.gamestateHandler.setGamestateLocation(location);
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
      default:
        return [];
    }
  }

  drawCards(player: Player, cardLocation: CardLocation, count: number, exclude: Card | null) {
    this.cardHandler.chain.push(
      () => {
        this.cardHandler.setActiveSearchCardsAction(CardAction.DRAW);
        this.cardHandler.setActiveSearchCards(
          this.getCards(player, cardLocation).filter(card =>card.name !== exclude?.name));
        this.cardHandler.setActiveSearchCardsCount(count);
      });
  }

  viewCards(player: Player, cardLocation: CardLocation): void {
    this.cardHandler.chain.push(
      () => {
        this.cardHandler.setActiveSearchCardsAction(cardLocation === CardLocation.GRAVEYARD ?
          CardAction.VIEW_GRAVEYARD : CardAction.VIEW_DECK);
        this.cardHandler.setActiveSearchCards(this.getCards(player, cardLocation));
        this.cardHandler.setActiveSearchCardsCount(0);
      });
  }

  viewActivatableCards(player: Player, cardLocation: CardLocation): void {
    this.cardHandler.chain.push(
      () => {
        this.cardHandler.setActiveSearchCardsAction(CardAction.ACTIVATE);
        this.cardHandler.setActiveSearchCards(this.getCards(player, cardLocation).filter(
          card => card.canActivate()));
        this.cardHandler.setActiveSearchCardsCount(0);
      });
  }

  drawCardsByArchetype(player: Player, cardLocation: CardLocation, archetype: Archetype, count: number,
                       exclude: Card | null) {
    this.cardHandler.chain.push(
      () => {
        this.cardHandler.setActiveSearchCardsAction(CardAction.DRAW);
        this.cardHandler.setActiveSearchCards(
          this.getCards(player, cardLocation).filter(card => card.archetype === archetype
            && card.name !== exclude?.name));
        this.cardHandler.setActiveSearchCardsCount(count);
      });
  }

  drawCardsByName(player: Player, cardLocation: CardLocation, name: string, count: number, exclude: Card | null) {
    this.cardHandler.chain.push(
      () => {
        this.cardHandler.setActiveSearchCardsAction(CardAction.DRAW);
        this.cardHandler.setActiveSearchCards(
          this.getCards(player, cardLocation).filter(
            card => card.name.toLowerCase().includes(name.toLowerCase()) && card.name !== exclude?.name));
        this.cardHandler.setActiveSearchCardsCount(count);
      });
  }

  drawCardsByArchetypeAndName(player: Player, cardLocation: CardLocation, archetype: Archetype, name: string,
                              count: number, exclude: Card | null) {
    this.cardHandler.chain.push(
      () => {
        this.cardHandler.setActiveSearchCardsAction(CardAction.DRAW);
        this.cardHandler.setActiveSearchCards(
          this.getCards(player, cardLocation).filter(
            card => card.archetype === archetype && card.name.toLowerCase().includes(name.toLowerCase())
              && card.name !== exclude?.name));
        this.cardHandler.setActiveSearchCardsCount(count);
      });
  }

  drawCardsByArchetypeAndType(player: Player, cardLocation: CardLocation, archetype: Archetype, cardType: CardType,
                              count: number, exclude: Card | null) {
    this.cardHandler.chain.push(
      () => {
        this.cardHandler.setActiveSearchCardsAction(CardAction.DRAW);
        this.cardHandler.setActiveSearchCards(
          this.getCards(player, cardLocation)
            .filter(card => card.archetype === archetype && card.type === cardType && card.name !== exclude?.name));
        this.cardHandler.setActiveSearchCardsCount(count);
      });
  }

  destroyCardsByPlayerAndType(player: Player, cardLocation: CardLocation, cardType: CardType, count: number,
                              exclude: Card | null): void {
    this.cardHandler.chain.push(
      () => {
        this.cardHandler.setActiveSearchCardsAction(CardAction.DESTROY);
        this.cardHandler.setActiveSearchCards(
          this.getCards(player, cardLocation).filter(card => card.type === cardType &&
            card.name !== exclude?.name));
        this.cardHandler.setActiveSearchCardsCount(count);
      });
  }

  destroyCardsByPlayerAndTypeAndAttack(player: Player, cardLocation: CardLocation, cardType: CardType, attack: number,
                                       count: number, exclude: Card | null): void {
    this.cardHandler.chain.push(
      () => {
        this.cardHandler.setActiveSearchCardsAction(CardAction.DESTROY);
        this.cardHandler.setActiveSearchCards(
          this.getCards(player, cardLocation).filter(card => card.type === cardType &&
            card.attack <= attack && card.name !== exclude?.name));
        this.cardHandler.setActiveSearchCardsCount(count);
      });
  }

  destroyCardsByPlayerAndArchetype(player: Player, cardLocation: CardLocation, archetype: Archetype, count: number,
                                   exclude: Card | null): void {
    this.cardHandler.chain.push(
      () => {
        this.cardHandler.setActiveSearchCardsAction(CardAction.DESTROY);
        this.cardHandler.setActiveSearchCards(
          this.getCards(player, cardLocation).filter(card => card.archetype === archetype
            && card.name !== exclude?.name));
        this.cardHandler.setActiveSearchCardsCount(count);
      });
  }

  destroyCardsByPlayerAndArchetypeAndName(player: Player, cardLocation: CardLocation, archetype: Archetype,
                                          name: string, count: number, exclude: Card | null): void {
    this.cardHandler.chain.push(
      () => {
        this.cardHandler.setActiveSearchCardsAction(CardAction.DESTROY);
        this.cardHandler.setActiveSearchCards(
          this.getCards(player, cardLocation).filter(card => card.archetype === archetype &&
            card.name.toLowerCase().includes(name.toLowerCase()) && card.name !== exclude?.name));
        this.cardHandler.setActiveSearchCardsCount(count);
      });
  }

  destroyCardsByPlayerAndTypeAndArchetype(player: Player, cardLocation: CardLocation, cardType: CardType,
                                          archetype: Archetype, count: number, exclude: Card | null): void {
    this.cardHandler.chain.push(
      () => {
        this.cardHandler.setActiveSearchCardsAction(CardAction.DESTROY);
        this.cardHandler.setActiveSearchCards(
          this.getCards(player, cardLocation).filter(
            card => card.type === cardType && card.archetype === archetype && card.name !== exclude?.name));
        this.cardHandler.setActiveSearchCardsCount(count);
      });
  }

  destroyCardsByPlayer(player: Player, cardLocation: CardLocation, count: number, exclude: Card | null): void {
    this.cardHandler.chain.push(
      () => {
        this.cardHandler.setActiveSearchCardsAction(CardAction.DESTROY);
        this.cardHandler.setActiveSearchCards(
          this.getCards(player, cardLocation).filter(card =>card.name !== exclude?.name));
        this.cardHandler.setActiveSearchCardsCount(count);
      });
  }

  destroyCards(player: Player, cardLocation: CardLocation, count: number, exclude: Card | null): void {
    this.cardHandler.chain.push(
      () => {
        this.cardHandler.setActiveSearchCardsAction(CardAction.DESTROY);
        this.cardHandler.setActiveSearchCards(
          this.getCards(null, cardLocation).filter(card => card.name !== exclude?.name));
        this.cardHandler.setActiveSearchCardsCount(count);
      });
  }

  discardCards(player: Player, cardLocation: CardLocation, count: number, exclude: Card | null): void {
    this.cardHandler.chain.push(
      () => {
        this.cardHandler.setActiveSearchCardsAction(CardAction.DISCARD);
        this.cardHandler.setActiveSearchCards(
          this.getCards(player, cardLocation).filter(card => card.name !== exclude?.name));
        this.cardHandler.setActiveSearchCardsCount(count);
      });
  }

  discardCardsByArchetype(player: Player, cardLocation: CardLocation, archetype: Archetype, count: number,
                          exclude: Card | null): void {
    this.cardHandler.chain.push(
      () => {
        this.cardHandler.setActiveSearchCardsAction(CardAction.DISCARD);
        this.cardHandler.setActiveSearchCards(
          this.getCards(player, cardLocation).filter(card => card.archetype === archetype
            && card.name !== exclude?.name));
        this.cardHandler.setActiveSearchCardsCount(count);
      });
  }

  discardCardsByArchetypeAndType(player: Player, cardLocation: CardLocation, archetype: Archetype, cardType: CardType,
                                 count: number, exclude: Card | null): void {
    this.cardHandler.chain.push(
      () => {
        this.cardHandler.setActiveSearchCardsAction(CardAction.DISCARD);
        this.cardHandler.setActiveSearchCards(
          this.getCards(player, cardLocation).filter(card => card.archetype === archetype
            && card.type === cardType && card.name !== exclude?.name));
        this.cardHandler.setActiveSearchCardsCount(count);
      });
  }

  banishCardsByArchetype(player: Player, cardLocation: CardLocation, archetype: Archetype, count: number,
              exclude: Card | null): void {
    this.cardHandler.chain.push(
      () => {
        this.cardHandler.setActiveSearchCardsAction(CardAction.BANISH);
        this.cardHandler.setActiveSearchCards(
          this.getCards(player, cardLocation).filter(card => card.archetype === archetype &&
            card.name !== exclude?.name));
        this.cardHandler.setActiveSearchCardsCount(count);
      });
  }

  millCardsByArchetype(player: Player, cardLocation: CardLocation, archetype: Archetype, count: number,
                          exclude: Card | null): void {
    this.cardHandler.chain.push(
      () => {
        this.cardHandler.setActiveSearchCardsAction(CardAction.MILL);
        this.cardHandler.setActiveSearchCards(
          this.getCards(player, cardLocation).filter(card => card.archetype === archetype
            && card.name !== exclude?.name));
        this.cardHandler.setActiveSearchCardsCount(count);
      });
  }

  destroyCardsByPlayerWoodAmount(player: Player, cardLocation: CardLocation, amount: number, count: number,
                                 exclude: Card | null): void {
    this.cardHandler.chain.push(
      () => {
        this.cardHandler.setActiveSearchCardsAction(CardAction.DESTROY);
        this.cardHandler.setActiveSearchCards(
          this.getCards(player, cardLocation).filter(card => card.remainingHealth < amount &&
            card.name !== exclude?.name));
        this.cardHandler.setActiveSearchCardsCount(count)
      });
  }

  summonCardsByArchetype(player: Player, cardLocation: CardLocation, archetype: Archetype, count: number,
                         exclude: Card | null): void {
    this.cardHandler.chain.push(
      () => {
        this.cardHandler.setActiveSearchCardsAction(CardAction.SUMMON);
        this.cardHandler.setActiveSearchCards(
          this.getCards(player, cardLocation).filter(card => card.archetype === archetype &&
            card.type === CardType.UNIT && card.name !== exclude?.name));
        this.cardHandler.setActiveSearchCardsCount(count);
      });
  }

  summonCardsByArchetypeAndHealth(player: Player, cardLocation: CardLocation, archetype: Archetype, health: number,
                                  count: number, exclude: Card | null): void {
    this.cardHandler.chain.push(
      () => {
        this.cardHandler.setActiveSearchCardsAction(CardAction.SUMMON);
        this.cardHandler.setActiveSearchCards(
          this.getCards(player, cardLocation).filter(card => card.archetype === archetype &&
            card.type === CardType.UNIT && card.maxHealth <= health && card.name !== exclude?.name));
        this.cardHandler.setActiveSearchCardsCount(count);
      });
  }

  summonCardsByArchetypeAndAttack(player: Player, cardLocation: CardLocation, archetype: Archetype, attack: number,
                                  count: number, exclude: Card | null): void {
    this.cardHandler.chain.push(
      () => {
        this.cardHandler.setActiveSearchCardsAction(CardAction.SUMMON);
        this.cardHandler.setActiveSearchCards(
          this.getCards(player, cardLocation).filter(card => card.archetype === archetype &&
            card.type === CardType.UNIT && card.attack <= attack && card.name !== exclude?.name));
        this.cardHandler.setActiveSearchCardsCount(count);
      });
  }

  placeCardsByArchetype(player: Player, cardLocation: CardLocation, archetype: Archetype, count: number,
                        exclude: Card | null): void {
    this.cardHandler.chain.push(
      () => {
        this.cardHandler.setActiveSearchCardsAction(CardAction.PLACE);
        this.cardHandler.setActiveSearchCards(
          this.getCards(player, cardLocation).filter(
            card => card.archetype === archetype && card.type === CardType.BUILDING &&
              card.name !== exclude?.name));
        this.cardHandler.setActiveSearchCardsCount(count);
      });
  }

  placeCardsByName(player: Player, cardLocation: CardLocation, name: string, count: number,
                        exclude: Card | null): void {
    this.cardHandler.chain.push(
      () => {
        this.cardHandler.setActiveSearchCardsAction(CardAction.PLACE);
        this.cardHandler.setActiveSearchCards(
          this.getCards(player, cardLocation).filter(
            card => card.name.toLowerCase().includes(name.toLowerCase()) && card.name !== exclude?.name));
        this.cardHandler.setActiveSearchCardsCount(count);
      });
  }
}
