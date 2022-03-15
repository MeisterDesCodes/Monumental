import {Card} from "../shared/card";
import {Player} from "../shared/player";
import {Injectable} from "@angular/core";
import {Element} from "../shared/element";
import {GamestateHandler} from "./gamestate-handler";
import {GamestateType} from "../shared/gamestate-type";
import {CardAction} from "../shared/card-action";

@Injectable()
export class CardHandler {

  activeCard: Card | null = null;
  activeCardAction: CardAction | null = null;

  constructor(private gamestateHandler: GamestateHandler) {
  }

  setActiveCard(card: Card | null): void {
    this.activeCard = card;
  }

  getActiveCard(): Card | null {
    return this.activeCard;
  }

  setActiveCardAction(cardAction: CardAction | null): void {
    this.activeCardAction = cardAction;
  }

  getActiveCardAction(): CardAction | null {
    return this.activeCardAction;
  }

  summonCard(card: Card) {
    this.removeCardFromHand(card);
    this.addCardToField(card);
    card.onSummon();
  }

  placeCard(card: Card) {
    this.removeCardFromHand(card);
    this.addCardToField(card);
    card.onPlace();
  }

  activateCard(card: Card) {
    card.remainingUses--;
    card.onActivate();
  }

  discardCard(card: Card) {
    this.removeCardFromHand(card);
    card.onDiscard();
  }

  removeCardFromHand(card: Card) {
    card.owner.hand.cards.splice(card.owner.hand.cards.indexOf(card), 1);
  }

  addCardToField(card: Card) {
    card.owner.field.cards.push(card);
  }

  showCardSummonOptions(card: Card) {
    this.gamestateHandler.setGamestate(GamestateType.SUMMON);
    this.setActiveCard(card);
    this.setActiveCardAction(CardAction.SUMMON);
  }

  showCardPlaceOptions(card: Card) {
    this.gamestateHandler.setGamestate(GamestateType.PLACE);
    this.setActiveCard(card);
    this.setActiveCardAction(CardAction.PLACE);
  }

  canActivateCard(card: Card): boolean {
    return card.remainingUses >= 1;
  }

  canSummonCard(card: Card): boolean {
    return this.canPlaceCard(card);
  }

  canPlaceCard(card: Card): boolean {
    for (let i = 0; i < card.elementCosts.length; i++) {
      let element: Element | undefined =
        card.owner.elementals.find(element => element.type === card.elementCosts[i].type);
      if (!element || element.amount < card.elementCosts[i].amount) {
        return false;
      }
    }
    return true;
  }

  canDiscardCard(card: Card): boolean {
    return true;
  }

  gainElement(player: Player, element: Element): void {
    let tempElement: Element | undefined =
      player.elementals.find(playerElement => playerElement.type === element.type);
    tempElement ? tempElement.amount += element.amount : player.elementals.push(element);
  }

  payElementCost(card: Card): void {
    for (let i = 0; i < card.elementCosts.length; i++) {
      let element: Element | undefined =
        card.owner.elementals.find(element => element.type === card.elementCosts[i].type);
      element!.amount -= card.elementCosts[i].amount;
      if (element!.amount === 0) {
        //TODO card.owner.elements.splice(card.owner.elements.indexOf(element!, 1));
      }
    }
  }

  drawCards(player: Player, amount: number): void {
    if (player.deck.cards.length >= amount) {
      for (let i = 0; i < amount; i++) {
        let card = player.deck.cards.pop()!;
        player.hand.cards.push(card);
      }
    }
    else {
      console.log('Defeat!');
    }
  }

  resetCards(player: Player): void {
    this.getAllCardsFromPlayer(player).forEach(card => card.remainingUses = card.maxUses);
  }

  getAllCardsFromPlayer(player: Player): Card[] {
    return player.hand.cards.concat(player.deck.cards);
  }

  triggerStandbyPhase(player: Player): void {
    player.field.cards.forEach(card => card.onStandby());
  }
}
