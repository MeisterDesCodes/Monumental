import {Card} from "../shared/card";
import {Player} from "../shared/player";
import {Injectable} from "@angular/core";
import {Element} from "../shared/models/element";
import {GamestateHandler} from "./gamestate-handler";
import {GamestateType} from "../shared/enums/gamestate-type";
import {CardAction} from "../shared/enums/card-action";
import {CardType} from "../shared/enums/card-type";
import {CardLocation} from "../shared/enums/card-location";
import {GamephaseHandler} from "./gamephase-handler";
import {GamephaseType} from "../shared/enums/gamephase-type";
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
  }

  activateCard(card: Card) {
    if (card.type === CardType.SPELL) {
      this.payElementCosts(card);
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
    defender.remainingHealth -= Math.ceil(attacker.attack * attacker.attackModifierOnAttack() *
      defender.defenseModifierOnBeingAttacked());
    attacker.remainingHealth -= Math.ceil(defender.attack * attacker.defenseModifierOnAttack() *
      defender.attackModifierOnBeingAttacked());
    if (defender.remainingHealth <= 0) {
      this.killUnit(defender);
      attacker.onKill();
    }
    if (attacker.remainingHealth <= 0) {
      this.killUnit(attacker);
      defender.onKill();
    }
    attacker.remainingAttacks--;
    this.resetState();
    attacker.onAttack();
    defender.onBeingAttacked();
  }

  killUnit(card: Card): void {
    this.sendCardFromFieldToGraveyard(card);
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
    this.playerHandler.damagePlayer(this.playerHandler.getEnemyPlayer(), card.attack);
    card.remainingAttacks--;
    this.resetState();
    card.onAttack();
    card.onDirectAttack();
  }

  canActivateCard(card: Card): boolean {
    return card.canActivate() && this.canPayActivationCosts(card) && card.remainingUses >= 1;
  }

  canSummonCard(card: Card): boolean {
   return card.location === CardLocation.HAND &&
     this.gamephaseHandler.isValidGamePhase([GamephaseType.MAIN]) && this.canPayElementCosts(card);
  }

  canPayElementCosts(card: Card): boolean {
    for (let i = 0; i < card.elementCosts.length; i++) {
      let element: Element = this.playerHandler.getElement(card.owner, card.elementCosts[i].type);
      if (!element || element.amount < card.elementCosts[i].amount) {
        return false;
      }
    }
    return true;
  }

  canPayActivationCosts(card: Card): boolean {
    if (card.type === CardType.SPELL) {
      return this.canPayElementCosts(card);
    } else {
      return card.canPayActivationCosts();
    }
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
    let tempElement: Element = this.playerHandler.getElement(player, element.type);
    tempElement ? tempElement.amount += element.amount : player.elementals.push(element);
  }

  payElementCosts(card: Card): void {
    for (let i = 0; i < card.elementCosts.length; i++) {
      let element: Element = this.playerHandler.getElement(card.owner, card.elementCosts[i].type);
      element.amount -= card.elementCosts[i].amount;
      if (element.amount === 0) {
        card.owner.elementals.splice(card.owner.elementals.indexOf(element), 1);
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
    this.getAllCardsFromPlayer(player).forEach(card => {
      card.remainingUses = card.maxUses;
      card.remainingAttacks = card.maxAttacks;
    });
  }

  getAllCardsFromPlayer(player: Player): Card[] {
    return player.hand.cards.concat(player.deck.cards).concat(player.field.cards).concat(player.graveyard.cards);
  }

  triggerStandbyPhase(player: Player): void {
    player.field.cards.forEach(card => card.onStandbyPhase());
  }

  triggerMainPhase(player: Player): void {
    player.field.cards.forEach(card => card.onMainPhase());
  }
}
