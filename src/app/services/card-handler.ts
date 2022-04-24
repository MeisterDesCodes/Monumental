import {Card} from "../shared/card";
import {Player} from "../shared/player";
import {Injectable} from "@angular/core";
import {Element} from "../shared/element";
import {GamestateHandler} from "./gamestate-handler";
import {GamestateType} from "../shared/gamestate-type";
import {CardAction} from "../shared/card-action";
import {CardType} from "../shared/card-type";
import {CardLocation} from "../shared/card-location";
import {GamephaseHandler} from "./gamephase-handler";
import {GamephaseType} from "../shared/gamephase-type";
import {PlayerHandler} from "./player-handler";

@Injectable()
export class CardHandler {

  selectedCard: Card | null = null;
  activeCard: Card | null = null;
  activeCardAction: CardAction | null = null;
  activeSearchCards: Card[] | null = null;
  activeSearchCardsAction: CardAction | null = null;

  constructor(private gamestateHandler: GamestateHandler, private gamephaseHandler: GamephaseHandler,
              private playerHandler: PlayerHandler) {
  }

  setSelectedCard(card: Card | null): void {
    this.selectedCard = card;
  }

  getSelectedCard(): Card | null {
    return this.selectedCard;
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

  setActiveSearchCards(cards: Card[] | null): void {
    this.activeSearchCards = cards;
  }

  getActiveSearchCards(): Card[] | null {
    return this.activeSearchCards;
  }

  setActiveSearchCardsAction(cardAction: CardAction | null): void {
    this.activeSearchCardsAction = cardAction;
  }

  getActiveSearchCardsAction(): CardAction | null {
    return this.activeSearchCardsAction;
  }

  resetState(): void {
    this.setActiveCard(null);
    this.setActiveCardAction(null);
    this.gamestateHandler.setGamestate(GamestateType.NORMAL);
  }

  summonCard(card: Card) {
    this.placeOrSummonCard(card);
    card.onSummon();
  }

  placeCard(card: Card) {
    this.placeOrSummonCard(card);
    card.onPlace();
  }

  placeOrSummonCard(card: Card) {
    this.removeCardFromHand(card);
    this.addCardToField(card);
    this.setActiveCard(null);
  }

  activateCard(card: Card) {
    if (card.type === CardType.SPELL) {
      this.sendCardFromHandToGraveyard(card);
    }
    else {
      card.remainingUses--;
    }
    card.onActivate();
  }

  discardCard(card: Card) {
    this.sendCardFromHandToGraveyard(card);
    card.onDiscard();
  }

  attackUnit(attacker: Card, defender: Card) {
    defender.remainingHealth -= attacker.attack;
    attacker.remainingHealth -= defender.attack;
    if (defender.remainingHealth <= 0) {
      this.sendCardFromFieldToGraveyard(defender);
      defender.onKill();
    }
    if (attacker.remainingHealth <= 0) {
      this.sendCardFromFieldToGraveyard(attacker);
      attacker.onKill();
    }
    attacker.remainingAttacks--;
    this.resetState();
    attacker.onAttack();
  }

  removeCardFromHand(card: Card) {
    card.owner.hand.cards.splice(card.owner.hand.cards.indexOf(card), 1);
  }

  removeCardFromDeck(card: Card) {
    card.owner.deck.cards.splice(card.owner.deck.cards.indexOf(card), 1);
  }

  removeCardFromField(card: Card) {
    card.owner.field.cards.splice(card.owner.field.cards.indexOf(card), 1);
    card.slot!.card = null;
    card.remainingHealth = card.maxHealth;
  }

  addCardToField(card: Card) {
    card.owner.field.cards.push(card);
    card.location = CardLocation.FIELD;
  }

  addCardToGraveyard(card: Card) {
    card.owner.graveyard.cards.push(card);
    card.location = CardLocation.GRAVEYARD;
  }

  addCardToHand(card: Card) {
    card.owner.hand.cards.push(card);
    card.location = CardLocation.HAND;
  }

  addCardFromDeckToHand(card: Card) {
    this.removeCardFromDeck(card);
    this.addCardToHand(card);
  }

  sendCardFromFieldToGraveyard(card: Card) {
    this.removeCardFromField(card);
    this.addCardToGraveyard(card);
  }

  sendCardFromHandToGraveyard(card: Card) {
    this.removeCardFromHand(card);
    this.addCardToGraveyard(card);
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

  showAttackOptions(card: Card) {
    if (this.playerHandler.getEnemyUnits().length === 0) {
      this.attackDirectly(card);
    }
    else {
      this.gamestateHandler.setGamestate(GamestateType.ATTACK);
      this.setActiveCard(card);
      this.setActiveCardAction(CardAction.ATTACK);
    }
  }

  attackDirectly(card: Card): void {
    let enemyPlayer: Player = this.playerHandler.getEnemyPlayer();
    enemyPlayer.remainingHealth -= card.attack;
    if (enemyPlayer.remainingHealth <= 0) {
      //TODO
    }
    card.remainingAttacks--;
    this.resetState();
    card.onAttack();
    card.onDirectAttack();
  }

  canActivateCard(card: Card): boolean {
    return card.remainingUses >= 1;
  }

  canSummonCard(card: Card): boolean {
    if (card.location !== CardLocation.HAND
      || !this.gamephaseHandler.isValidGamePhase([GamephaseType.MAIN])) {
      return false;
    }
    for (let i = 0; i < card.elementCosts.length; i++) {
      let element: Element | undefined =
        card.owner.elementals.find(element => element.type === card.elementCosts[i].type);
      if (!element || element.amount < card.elementCosts[i].amount) {
        return false;
      }
    }
    return true;
  }

  canPlaceCard(card: Card): boolean {
    return this.canSummonCard(card);
  }

  canDiscardCard(card: Card): boolean {
    return card.location === CardLocation.HAND;
  }

  canAttack(card: Card): boolean {
    return card.type === CardType.UNIT && card.remainingAttacks >= 1 && card.location === CardLocation.FIELD &&
      this.gamephaseHandler.isValidGamePhase([GamephaseType.COMBAT]);
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
        card.location = CardLocation.HAND;
      }
    }
    else {
      //TODO
    }
  }

  resetCards(player: Player): void {
    this.getAllCardsFromPlayer(player).forEach(card => card.remainingUses = card.maxUses);
  }

  getAllCardsFromPlayer(player: Player): Card[] {
    return player.hand.cards.concat(player.deck.cards);
  }

  triggerStandbyPhase(player: Player): void {
    player.field.cards.forEach(card => card.onStandbyPhase());
  }

  triggerMainPhase(player: Player): void {
    player.field.cards.forEach(card => card.onMainPhase());
  }
}
