import {Card, SP} from "../shared/card";
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
import {interval} from "rxjs";
import {ElementType} from "../shared/enums/element-type";
import {Archetype} from "../shared/enums/archetype";

@Injectable()
export class CardHandler {

  selectedCard: Card | null = null;
  activeCard: Card | null = null;
  activeCardAction: CardAction | null = null;
  activeSearchCards: Card[] = [];
  activeSearchCardsAction: CardAction | null = null;
  activeSearchCardsCount: number = 0;
  selectedSearchCards: Card[] = [];

  chain: Function[] = [];
  chainActive: boolean = false;

  chainTrigger = interval(100).subscribe(() => this.triggerChain());

  constructor(private gamestateHandler: GamestateHandler, private gamephaseHandler: GamephaseHandler,
              private playerHandler: PlayerHandler) {
  }

  setSelectedCard(card: Card | null) {
    this.getSelectedCard() !== card ? this.selectedCard = card : this.selectedCard = null;
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

  setActiveSearchCards(cards: Card[]): void {
    this.activeSearchCards = cards;
  }

  getActiveSearchCards(): Card[] {
    return this.activeSearchCards;
  }

  setActiveSearchCardsAction(cardAction: CardAction | null): void {
    this.activeSearchCardsAction = cardAction;
  }

  getActiveSearchCardsAction(): CardAction | null {
    return this.activeSearchCardsAction;
  }

  setActiveSearchCardsCount(count: number): void {
    this.activeSearchCardsCount = count;
  }

  getActiveSearchCardsCount(): number {
    return this.activeSearchCardsCount;
  }

  setSelectedSearchCards(cards: Card[]): void {
    this.selectedSearchCards = cards;
  }

  getSelectedSearchCards(): Card[] {
    return this.selectedSearchCards;
  }

  setChainActive(value: boolean): void {
    this.chainActive = value;
  }

  getChainActive(): boolean {
    return this.chainActive;
  }

  triggerChain(): void {
    if (this.chain.length >= 1 && !this.getChainActive()) {
      this.setChainActive(true);
      this.chain.pop()!();
    }
  }

  continueOrBreakChain(): void {
    if (!this.gamestateHandler.isValidGamestate([GamestateType.SPECIAL_SUMMON,
      GamestateType.SPECIAL_PLACE])) {
      if (SP.getCardHandler().chain.length >= 1) {
        this.chain.pop()!();
      }
      else {
        this.setChainActive(false);
      }
    }
  }

  resetState(): void {
    this.setActiveCard(null);
    this.setActiveCardAction(null);
    this.gamestateHandler.setGamestate(GamestateType.NORMAL);
  }

  summonCard(card: Card): void {
    this.placeOrSummonCard(card);
    card.onSummon();
  }

  placeCard(card: Card): void {
    this.placeOrSummonCard(card);
    card.onPlace();
  }

  specialSummonCard(card: Card): void {
    this.placeOrSummonCard(card);
    card.onSpecialSummon();
  }

  specialPlaceCard(card: Card): void {
    this.placeOrSummonCard(card);
    card.onSpecialPlace();
  }

  placeOrSummonCard(card: Card): void {
    if (card.location === CardLocation.HAND) {
      this.removeCardFromHand(card);
    }
    this.addCardToField(card);
    this.playerHandler.getFieldCards().forEach(card => card.onCardAddedToField(card));
    this.setChainActive(false);
  }

  activateCard(card: Card): void {
    if (card.type === CardType.SPELL && card.location === CardLocation.HAND) {
      this.payElementCosts(card);
      this.sendCardFromHandToGraveyard(card);
    }
    else {
      card.remainingUses--;
    }
    card.onActivate();
  }

  discardCard(card: Card): void {
    this.sendCardFromHandToGraveyard(card);
    card.onDiscard();
  }

  banishCard(card: Card): void {
    this.removeCardFromGraveyard(card);
    card.onBanish();
  }

  millCard(card: Card): void {
    this.sendCardFromDeckToGraveyard(card);
    card.onMill();
  }

  destroyCard(card: Card): void {
    if (card.canBeDestroyed()) {
      this.sendCardFromFieldToGraveyard(card);
      card.onDestroy();
    }
  }

  attackUnit(attacker: Card, defender: Card) {
    this.resetState();
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
    card.attack = card.originalAttack;
    card.remainingHealth = card.originalHealth;
  }

  removeCardFromGraveyard(card: Card) {
    card.owner.graveyard.cards.splice(card.owner.graveyard.cards.indexOf(card), 1);
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

  addCardFromGraveyardToHand(card: Card) {
    this.removeCardFromGraveyard(card);
    this.addCardToHand(card);
  }

  sendCardFromFieldToGraveyard(card: Card) {
    this.removeCardFromField(card);
    this.addCardToGraveyard(card);
    card.onRemoveFromField();
  }

  sendCardFromHandToGraveyard(card: Card) {
    this.removeCardFromHand(card);
    this.addCardToGraveyard(card);
    card.onRemoveFromHand();
  }

  sendCardFromDeckToGraveyard(card: Card) {
    this.removeCardFromDeck(card);
    this.addCardToGraveyard(card);
    card.onRemoveFromDeck();
  }

  addCardFromGraveyardToField(card: Card) {
    this.removeCardFromGraveyard(card);
    card.onRemoveFromGraveyard();
    this.summonOrPlaceCardOnField(card);
  }

  addCardFromHandToField(card: Card) {
    this.removeCardFromHand(card);
    card.onRemoveFromHand();
    this.summonOrPlaceCardOnField(card);
  }

  addCardFromDeckToField(card: Card) {
    this.removeCardFromDeck(card);
    card.onRemoveFromDeck();
    this.summonOrPlaceCardOnField(card);
  }

  summonOrPlaceCardOnField(card: Card): void {
    this.setActiveCard(card);
    if (card.type === CardType.UNIT) {
      this.gamestateHandler.setGamestate(GamestateType.SPECIAL_SUMMON);
      this.setActiveCardAction(CardAction.SPECIAL_SUMMON);
    }
    else {
      this.gamestateHandler.setGamestate(GamestateType.SPECIAL_PLACE);
      this.setActiveCardAction(CardAction.SPECIAL_PLACE);
    }
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

  showCardSpecialSummonOptions(card: Card) {
    this.gamestateHandler.setGamestate(GamestateType.SPECIAL_SUMMON);
    this.setActiveCard(card);
    this.setActiveCardAction(CardAction.SPECIAL_SUMMON);
  }

  showCardSpecialPlaceOptions(card: Card) {
    this.gamestateHandler.setGamestate(GamestateType.SPECIAL_PLACE);
    this.setActiveCard(card);
    this.setActiveCardAction(CardAction.SPECIAL_PLACE);
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
    this.resetState();
    this.playerHandler.damagePlayer(this.playerHandler.getEnemyPlayer(), card.attack);
    card.remainingAttacks--;
    card.onAttack();
    card.onDirectAttack();
  }

  canActivateCard(card: Card): boolean {
    return card.canActivate() && this.canPayActivationCosts(card) &&
      card.remainingUses >= 1 && this.gamephaseHandler.isValidGamePhase([GamephaseType.MAIN]);
  }

  canPayActivationCosts(card: Card): boolean {
    return card.type === CardType.SPELL ? this.canPayElementCosts(card) : true;
  }

  canSummonCard(card: Card): boolean {
   return card.location === CardLocation.HAND && card.canSummon() &&
     this.gamephaseHandler.isValidGamePhase([GamephaseType.MAIN]) && this.canPayElementCosts(card);
  }

  canPlaceCard(card: Card): boolean {
    return card.location === CardLocation.HAND && card.canPlace() &&
      this.gamephaseHandler.isValidGamePhase([GamephaseType.MAIN]) && this.canPayElementCosts(card);
  }

  canSpecialSummonCard(card: Card): boolean {
    return card.location === CardLocation.HAND &&
      card.canSpecialSummon() && this.gamephaseHandler.isValidGamePhase([GamephaseType.MAIN]);
  }

  canSpecialPlaceCard(card: Card): boolean {
    return card.location === CardLocation.HAND &&
      card.canSpecialPlace() && this.gamephaseHandler.isValidGamePhase([GamephaseType.MAIN]);
  }

  canDiscardCard(card: Card): boolean {
    return card.location === CardLocation.HAND && card.canDiscard() &&
      this.gamephaseHandler.isValidGamePhase([GamephaseType.MAIN]);
  }

  canAttack(card: Card): boolean {
    return card.type === CardType.UNIT && card.remainingAttacks >= 1 && card.location === CardLocation.FIELD &&
      this.gamephaseHandler.isValidGamePhase([GamephaseType.COMBAT]);
  }

  canPayElementCosts(card: Card): boolean {
    for (let i = 0; i < card.elementCosts.length; i++) {
      let elementAmount: number = this.playerHandler.getElementAmount(card.owner, card.elementCosts[i].type);
      if (elementAmount < card.elementCosts[i].amount) {
        return false;
      }
    }
    return true;
  }

  gainElement(player: Player, element: Element): void {
    let tempElement: Element = this.playerHandler.getElement(player, element.type);
    tempElement ? tempElement.amount += element.amount : player.elementals.push(element);
    if (element.type === ElementType.WOOD) {
      this.playerHandler.getFieldCards().forEach(card => card.onWoodGain(element.amount));
    }
  }

  loseElement(player: Player, element: Element): void {
    let tempElement: Element = this.playerHandler.getElement(player, element.type);
    if (tempElement) {
      tempElement.amount -= element.amount
      if (tempElement.amount === 0) {
        player.elementals.splice(player.elementals.indexOf(element), 1);
      }
    }
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

  getCombinedElementCosts(card: Card): number {
    //TODO
    let amount: number = 0;
    for (let i = 0; i < card.elementCosts.length; i++) {
      amount += this.playerHandler.getElementAmount(card.owner, card.elementCosts[i].type);
    }
    return amount;
  }

  drawCards(player: Player, amount: number): void {
    this.chain.push(
      () => {
        if (player.deck.cards.length >= amount) {
          for (let i = 0; i < amount; i++) {
            let card = player.deck.cards.pop()!;
            player.hand.cards.push(card);
            card.location = CardLocation.HAND;
            this.continueOrBreakChain();
          }
        }
        else {
          //TODO
        }
      });
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

  triggerStandbyPhaseForArchetypeAndType(player: Player, archetype: Archetype, cardType: CardType): void {
    player.field.cards.forEach(card => {
      if (card.archetype === archetype && card.type === cardType) {
        card.onStandbyPhase();
      }
    });
  }

  triggerMainPhase(player: Player): void {
    player.field.cards.forEach(card => card.onMainPhase());
  }
}
