import {ElementType} from './enums/element-type';
import {Element} from "./models/element";
import {CardAction} from "./enums/card-action";
import {Player} from "./player";
import {CardType} from "./enums/card-type";
import {PlayerHandler} from "../services/player-handler";
import {DeckHandler} from "../services/deck-handler";
import {CardHandler} from "../services/card-handler";
import {GamestateHandler} from "../services/gamestate-handler";
import {serviceInjector} from "../app.module";
import {Archetype} from "./enums/archetype";
import {CardLocation} from "./enums/card-location";
import {UnitHandler} from "../services/unit-handler";
import {CardSlotComponent} from "../field/card-slot/card-slot.component";
import {SearchHandler} from "../services/search-handler";
import {SearchViewComponent} from "../search-view/search-view.component";

export class SP {

  static getGamestateHandler() {
    return serviceInjector.get(GamestateHandler);
  }
  static getCardHandler() {
    return serviceInjector.get(CardHandler);
  }
  static getDeckHandler() {
    return serviceInjector.get(DeckHandler);
  }
  static getPlayerHandler() {
    return serviceInjector.get(PlayerHandler);
  }
  static getUnitHandler() {
    return serviceInjector.get(UnitHandler);
  }
  static getSearchHandler() {
    return serviceInjector.get(SearchHandler);
  }
  static getSearchViewComponent() {
    return serviceInjector.get(SearchViewComponent);
  }
}

export class Card {

  owner: Player = null!;

  location: CardLocation = CardLocation.DECK;
  slot: CardSlotComponent | null = null;

  originalAttack: number = 0;
  attack: number = this.originalAttack;

  originalHealth: number = 0;
  maxHealth: number = this.originalHealth;
  remainingHealth: number = this.originalHealth;

  maxUses: number = 1;
  remainingUses: number = this.maxUses;

  maxAttacks: number = 1;
  remainingAttacks: number = this.maxAttacks;

  name: string = '';
  description: string = '';
  type: CardType = CardType.UNIT;
  archetype: Archetype = Archetype.WOODLANDS;
  cardActions: CardAction[] = [];
  elementCosts: Element[] = [];
  imagePath: string = '';

  constructor() {
  }

  canActivate(): boolean {
    return this.type === CardType.SPELL ? this.location === CardLocation.HAND : this.location === CardLocation.FIELD;
  }
  canSummon(): boolean {
    return true;
  }
  canPlace(): boolean {
    return true;
  }
  canSpecialSummon(): boolean {
    return false;
  }
  canSpecialPlace(): boolean {
    return false;
  }
  canDiscard(): boolean {
    return true;
  }

  canBeDestroyed(): boolean {
    return true;
  }

  onActivate(): void {}
  onDiscard(): void {}
  onBanish(): void {}
  onSummon(): void {}
  onPlace(): void {}
  onSpecialSummon(): void {
    this.onSummon();
  }
  onSpecialPlace(): void {
    this.onPlace();
  }
  onMill(): void {}
  onDestroy(): void {}

  onRemoveFromField(): void {}
  onRemoveFromHand(): void {}
  onRemoveFromGraveyard(): void {}
  onRemoveFromDeck(): void {}

  attackModifierOnAttack() : number {
    return 1;
  }
  defenseModifierOnBeingAttacked() : number {
    return 1;
  }
  defenseModifierOnAttack() : number {
    return 1;
  }
  attackModifierOnBeingAttacked() : number {
    return 1;
  }

  onAttack(): void {}
  onDirectAttack(): void {}
  onBeingAttacked(): void {}
  onKill(): void {}

  onStandbyPhase(): void {}
  onMainPhase(): void {}

  onWoodGain(amount: number): void {}
  onCardAddedToField(card: Card): void {}

  setAttack(amount: number): void {
    this.originalAttack = amount;
    this.attack = this.originalAttack;
  }
  setHealth(amount: number): void {
    this.originalHealth = amount;
    this.maxHealth = this.originalHealth;
    this.remainingHealth = this.originalHealth;
  }

  setAttacks(amount: number): void {
    this.maxAttacks = amount;
    this.remainingAttacks = amount
  }

  setImagePath(): void {
    this.imagePath = this.name.split(' ').join('-').toLowerCase();
  }
}

export class BlankCard extends Card {

  constructor() {
    super();

    this.name = '';
    this.description = '';
    this.type = CardType.BLANK;
    this.archetype = Archetype.BLANK;
    this.imagePath = 'blank';
  }
}

export class Sawmill extends Card {

  constructor() {
    super();

    this.name = 'Sawmill';
    this.description = 'Place: Gain 1 ' + ElementType.WOOD + '.\n\n Standby: Gain 1 ' + ElementType.WOOD;
    this.type = CardType.BUILDING;
    this.cardActions = [CardAction.PLACE];

    this.onPlace = function() {
      SP.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 1});
    }
    this.onStandbyPhase = function() {
      if (this.location === CardLocation.FIELD) {
        SP.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 1});
      }
    }
  }
}

export class LogManufacturingPlant extends Card {

  constructor() {
    super();

    this.name = 'Log Manufacturing Plant';
    this.description = 'Place: Gain 3 ' + ElementType.WOOD + '.\n\n Standby: Gain 2 ' + ElementType.WOOD + '.';
    this.type = CardType.BUILDING;
    this.cardActions = [CardAction.PLACE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 4}];

    this.onPlace = function() {
      SP.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 3});
    }
    this.onStandbyPhase = function() {
      if (this.location === CardLocation.FIELD) {
        SP.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 2});
      }
    }
  }
}

export class TreetopSociety extends Card {

  constructor() {
    super();

    this.name = 'Treetop Society';
    this.description = 'Place: Draw 1 card.\n\n Standby: Gain 1 ' + ElementType.WOOD + ' ' +
      'and 1 ' + ElementType.DAWN + '.';
    this.type = CardType.BUILDING;
    this.cardActions = [CardAction.PLACE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 2}, {type: ElementType.DAWN, amount: 2}];

    this.onPlace = function(): void {
      SP.getCardHandler().drawCards(this.owner, 1);
    }
    this.onStandbyPhase = function(): void {
      if (this.location === CardLocation.FIELD) {
        SP.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 1});
        SP.getCardHandler().gainElement(this.owner, {type: ElementType.DAWN, amount: 1});
      }
    }
  }
}

export class LostParadise extends Card {

  constructor() {
    super();

    this.name = 'Lost Paradise';
    this.description = 'Activate: Pay 2 ' + ElementType.WOOD + '. Draw 1 Card.\n\n' +
      'Standby: Gain 1 ' + ElementType.WOOD + '.';
    this.type = CardType.BUILDING;
    this.cardActions = [CardAction.PLACE, CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 2}, {type: ElementType.DAWN, amount: 2},
      {type: ElementType.OCEAN, amount: 2}];

    this.canActivate = function(): boolean {
      return this.location === CardLocation.FIELD &&
        SP.getPlayerHandler().getElementAmount(this.owner, ElementType.WOOD) >= 2;
    }
    this.onActivate = function(): void {
      SP.getCardHandler().loseElement(this.owner, {type: ElementType.WOOD, amount: 2});
      SP.getCardHandler().drawCards(this.owner, 1);
    }
    this.onStandbyPhase = function(): void {
      if (this.location === CardLocation.FIELD) {
        SP.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 1});
      }
    }
  }
}

export class OvergrownTemple extends Card {

  constructor() {
    super();

    this.name = 'Overgrown Temple';
    this.description = 'Place: Add 1 ' + Archetype.WOODLANDS + ' Building from your deck to your hand.\n\n' +
      'Standby: Gain 1 ' + ElementType.WOOD + ' and 1 ' + ElementType.SHADOW + '.';
    this.type = CardType.BUILDING;
    this.cardActions = [CardAction.PLACE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 3}, {type: ElementType.SHADOW, amount: 2}];

    this.onPlace = function(): void {
      SP.getSearchHandler().drawCardsByArchetypeAndType(
        SP.getPlayerHandler().getCurrentPlayer(), CardLocation.DECK, Archetype.WOODLANDS, CardType.BUILDING,
        1, this);
    }
    this.onStandbyPhase = function(): void {
      if (this.location === CardLocation.FIELD) {
        SP.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 1});
        SP.getCardHandler().gainElement(this.owner, {type: ElementType.SHADOW, amount: 1});
      }
    }
  }
}

export class JungleShrine extends Card {

  constructor() {
    super();

    this.name = 'Jungle Shrine';
    this.description = 'Mill: Place this card.\n\n Everytime you a ' + Archetype.WOODLANDS + ' card is added to ' +
      'your side of the field, gain 1 ' + ElementType.WOOD + '. Removed: Send 1 ' + Archetype.WOODLANDS + ' card ' +
      'from your deck to the graveyard.';
    this.type = CardType.BUILDING;
    this.cardActions = [CardAction.PLACE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 3}, {type: ElementType.DAWN, amount: 1}];

    this.onMill = function(): void {
      SP.getCardHandler().setActiveSearchCardsAction(CardAction.PLACE);
      SP.getGamestateHandler().setGamestateLocation(CardLocation.GRAVEYARD);
      SP.getSearchViewComponent().selectCard(this);
    }
    this.onCardAddedToField = function(card: Card): void {
      if (card.archetype === Archetype.WOODLANDS) {
        SP.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 1});
      }
    }
    this.onRemoveFromField = function(): void {
      SP.getSearchHandler().millCardsByArchetype(this.owner, CardLocation.DECK, Archetype.WOODLANDS, 1, this);
    }
  }
}

export class SpiritTree extends Card {

  constructor() {
    super();

    this.name = 'Spirit Tree';
    this.description = 'Place: Add 2 ' + Archetype.WOODLANDS + ' "Spirit" cards from your deck to your hand.\n\n' +
      'Removed: Add 1 ' + Archetype.WOODLANDS + ' "Spirit" cards from your deck to your hand';
    this.type = CardType.BUILDING;
    this.cardActions = [CardAction.PLACE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 2},{type: ElementType.DAWN, amount: 1}];

    this.onPlace = function(): void {
      SP.getSearchHandler().drawCardsByArchetypeAndName(this.owner, CardLocation.DECK, Archetype.WOODLANDS,
        'Spirit', 2, this);
    }
    this.onRemoveFromField = function(): void {
      SP.getSearchHandler().drawCardsByArchetypeAndName(this.owner, CardLocation.DECK, Archetype.WOODLANDS,
        'Spirit', 1, this);
    }
  }
}

export class GardenOfHope extends Card {

  constructor() {
    super();

    this.name = 'Garden of Hope';
    this.description = 'Place: Banish 1 ' + Archetype.WOODLANDS + ' card from your graveyard. ' +
      'Gain 2 ' + ElementType.DAWN + '.\n\n' +
      'Standby: Gain 1 ' + ElementType.WOOD + ' and 1 ' + ElementType.DAWN + '.\n\n' +
      'Removed: Gain 2 ' + ElementType.WOOD + '.';
    this.type = CardType.BUILDING;
    this.cardActions = [CardAction.PLACE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 1}, {type: ElementType.OCEAN, amount: 1}];

    this.canPlace = function(): boolean {
      return this.owner.graveyard.cards.some(card => card.archetype === Archetype.WOODLANDS);
    }
    this.onPlace = function(): void {
      SP.getSearchHandler().banishCardsByArchetype(this.owner, CardLocation.GRAVEYARD, Archetype.WOODLANDS, 1,
        null);
      SP.getCardHandler().gainElement(this.owner, {type: ElementType.DAWN, amount: 2});
    }
    this.onStandbyPhase = function(): void {
      if (this.location === CardLocation.FIELD) {
        SP.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 1});
        SP.getCardHandler().gainElement(this.owner, {type: ElementType.DAWN, amount: 1});
      }
      this.onRemoveFromField = function(): void {
        SP.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 2});
      }
    }
  }
}

export class Wetlands extends Card {

  constructor() {
    super();

    this.name = 'Wetlands';
    this.description = 'Place: Discard 1 card. Gain 2 ' + ElementType.OCEAN + '.\n\n' +
      'Standby: Gain 1 ' + ElementType.WOOD + ' and 1 ' + ElementType.OCEAN + '.';
    this.type = CardType.BUILDING;
    this.cardActions = [CardAction.PLACE];

    this.canPlace = function(): boolean {
      return this.owner.hand.cards.length >= 1;
    }
    this.onPlace = function(): void {
      SP.getSearchHandler().discardCards(this.owner, CardLocation.HAND, 1, null);
      SP.getCardHandler().gainElement(this.owner, {type: ElementType.OCEAN, amount: 2});
    }
    this.onStandbyPhase = function(): void {
      if (this.location === CardLocation.FIELD) {
        SP.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 1});
        SP.getCardHandler().gainElement(this.owner, {type: ElementType.OCEAN, amount: 1});
      }
    }
  }
}

export class VerdantSanctuary extends Card {

  constructor() {
    super();

    this.name = 'Verdant Sanctuary';
    this.description = 'Every time ' + ElementType.WOOD + ' is gained, all ' + Archetype.WOODLANDS + ' units gain ' +
      'attack and health equal to the gained amount.';
    this.type = CardType.MONUMENT;
    this.cardActions = [CardAction.PLACE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 4}, {type: ElementType.OCEAN, amount: 2},
      {type: ElementType.DAWN, amount: 2}];

    this.onWoodGain = function(amount: number): void {
      if (this.location === CardLocation.FIELD) {
        SP.getUnitHandler().modifyUnitsStatsByArchetype(this.owner, amount, amount, Archetype.WOODLANDS);
      }
    }
  }
}

export class Terraduct extends Card {

  constructor() {
    super();

    this.name = 'Terraduct';
    this.description = 'Activate: Add 1 ' + Archetype.WOODLANDS + ' card from your deck to your hand.';
    this.type = CardType.MONUMENT;
    this.cardActions = [CardAction.PLACE, CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 6}, {type: ElementType.OCEAN, amount: 4}];

    this.onActivate = function(): void {
      SP.getSearchHandler().drawCardsByArchetype(this.owner, CardLocation.DECK, Archetype.WOODLANDS, 1, this);
    }
  }
}

export class StormValley extends Card {

  constructor() {
    super();

    this.name = 'Storm Valley';
    this.description = 'Standby: Destroy one of your buildings. Gain 3 ' + ElementType.STORM + '.';
    this.type = CardType.BUILDING;
    this.archetype = Archetype.NONE;
    this.cardActions = [CardAction.PLACE];

    this.onStandbyPhase = function(): void {
      if (this.location === CardLocation.FIELD) {
        SP.getSearchHandler().destroyCardsByPlayerAndType(this.owner, CardLocation.FIELD, CardType.BUILDING, 1,
          null);
        SP.getCardHandler().gainElement(this.owner, {type: ElementType.STORM, amount: 3});
      }
    }
  }
}

export class WoodlandsScout extends Card {

  constructor() {
    super();

    this.setAttack(3);
    this.setHealth(5);

    this.name = 'Woodlands Scout';
    this.description = 'Summon: Gain 1 ' + ElementType.WOOD + '.\n\n Removed: Gain 1 ' + ElementType.WOOD + '.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];

    this.onSummon = function(): void {
      SP.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 1});
    }
    this.onRemoveFromField = function(): void {
      SP.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 1});
    }
  }
}

export class SpiritWolf extends Card {

  constructor() {
    super();

    this.setAttack(8);
    this.setHealth(5);

    this.name = 'Spirit Wolf';
    this.description = 'Discard: Gain 2 ' + ElementType.WOOD + '.\n\n Graveyard: Banish this card to ' +
      'gain 1 ' + ElementType.WOOD + '.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON, CardAction.DISCARD, CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 1}];

    this.onDiscard = function(): void {
      SP.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 2});
    }
    this.canActivate = function(): boolean {
      return this.location === CardLocation.GRAVEYARD;
    }
    this.onActivate = function(): void {
      SP.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 1});
      SP.getCardHandler().removeCardFromGraveyard(this);
    }
  }
}

export class SpiritCrows extends Card {

  constructor() {
    super();

    this.setAttack(3);
    this.setHealth(4);

    this.name = 'Spirit Crows';
    this.description = 'Summon: Add 2 "' + this.name + '" from your Graveyard to your hand.\n\n' +
      'Discard: Gain 2 ' + ElementType.SHADOW;
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON, CardAction.DISCARD];
    this.elementCosts = [{type: ElementType.STORM, amount: 1}, {type: ElementType.SHADOW, amount: 1}];

    this.onSummon = function(): void {
      SP.getSearchHandler().drawCardsByName(this.owner, CardLocation.GRAVEYARD, this.name, 2,
        null);
    }
    this.onDiscard = function(): void {
      SP.getCardHandler().gainElement(this.owner, {type: ElementType.SHADOW, amount: 2});
    }
  }
}

export class ElderwoodDryad extends Card {

  constructor() {
    super();

    this.setAttack(2);
    this.setHealth(3);

    this.name = 'Elderwood Dryad';
    this.description = 'Discard: Send 1 ' + Archetype.WOODLANDS + ' card from your deck to the graveyard.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON, CardAction.DISCARD];

    this.onDiscard = function(): void {
      SP.getSearchHandler().millCardsByArchetype(this.owner, CardLocation.DECK, Archetype.WOODLANDS, 1, this);
    }
  }
}

export class ElderwoodStag extends Card {

  constructor() {
    super();

    this.setAttack(5);
    this.setHealth(4);

    this.name = 'Elderwood Stag';
    this.description = 'Discard: Summon 1 ' + Archetype.WOODLANDS + ' unit with 15 or less attack from your hand.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON, CardAction.DISCARD];

    this.canDiscard = function (): boolean {
      return this.location === CardLocation.HAND && this.owner.hand.cards.some(
        card => card !== this && card.archetype === Archetype.WOODLANDS && card.type === CardType.UNIT &&
          card.attack <= 15);
    }
    this.onDiscard = function(): void {
      SP.getSearchHandler().summonCardsByArchetypeAndAttack(this.owner, CardLocation.HAND, Archetype.WOODLANDS,
        15, 1, this);
    }
  }
}

export class SpiritDeer extends Card {

  constructor() {
    super();

    this.setAttack(2);
    this.setHealth(5);

    this.name = 'Spirit Deer';
    this.description = 'Summon: Place 1  "Spirit Tree" from your hand.\n\n' +
      'Discard: Gain 1 ' + ElementType.DAWN + ' and 1 ' + ElementType.OCEAN + '.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON, CardAction.DISCARD];

    this.onSummon = function(): void {
      SP.getSearchHandler().placeCardsByName(this.owner, CardLocation.HAND, 'Spirit Tree', 1, null);
    }
    this.onDiscard = function(): void {
      SP.getCardHandler().gainElement(this.owner, {type: ElementType.DAWN, amount: 1});
      SP.getCardHandler().gainElement(this.owner, {type: ElementType.OCEAN, amount: 1});
    }
  }
}

export class SpiritDragon extends Card {

  constructor() {
    super();

    this.setAttack(13);
    this.setHealth(11);

    this.name = 'Spirit Dragon';
    this.description = 'Discard: Gain 2 ' + ElementType.STORM + '.\n\n Removed: Gain 4 ' + ElementType.STORM + '.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON, CardAction.DISCARD];
    this.elementCosts = [{type: ElementType.WOOD, amount: 2}, {type: ElementType.STORM, amount: 2}];

    this.onDiscard = function(): void {
      SP.getCardHandler().gainElement(this.owner, {type: ElementType.STORM, amount: 2});
    }
    this.onRemoveFromField = function(): void {
      SP.getCardHandler().gainElement(this.owner, {type: ElementType.STORM, amount: 4});
    }
  }
}

export class BlightedTreant extends Card {

  constructor() {
    super();

    this.setAttack(13);
    this.setHealth(19);

    this.name = 'Blighted Treant';
    this.description = 'Standby: Restore 7 health';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 3}, {type: ElementType.SHADOW, amount: 3}];

    this.onStandbyPhase = function(): void {
      SP.getUnitHandler().healUnit(this, 7);
    }
  }
}

export class WoodlandsApexPredator extends Card {

  constructor() {
    super();

    this.setAttack(21);
    this.setHealth(11);

    this.name = 'Woodlands Apex Predator';
    this.description = 'Kill: Add 1 ' + Archetype.WOODLANDS + ' card from your deck to your hand.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 4}, {type: ElementType.SHADOW, amount: 2}];

    this.onKill = function(): void {
      SP.getSearchHandler().drawCardsByArchetype(this.owner, CardLocation.DECK, Archetype.WOODLANDS, 1,
        null);
    }
  }
}

export class WoodlandsWitch extends Card {

  constructor() {
    super();

    this.setAttack(8);
    this.setHealth(11);

    this.name = 'Woodlands Witch';
    this.description = 'Summon: Destroy 1 enemy unit with 10 or less attack on the field.\n\n' +
      'Removed: Add 1 ' + Archetype.WOODLANDS + ' spell from your graveyard to your hand';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 1}, {type: ElementType.SHADOW, amount: 2}];

    this.onSummon = function(): void {
      SP.getSearchHandler().destroyCardsByPlayerAndTypeAndAttack(SP.getPlayerHandler().getEnemyPlayer(),
        CardLocation.FIELD, CardType.UNIT, 10, 1, null);
    }
    this.onRemoveFromField = function(): void {
      SP.getSearchHandler().drawCardsByArchetypeAndType(this.owner, CardLocation.GRAVEYARD, Archetype.WOODLANDS,
        CardType.SPELL, 1, null);
    }
  }
}

export class ElderwoodProphet extends Card {

  constructor() {
    super();

    this.setAttack(2);
    this.setHealth(7);

    this.name = 'Elderwood Prophet';
    this.description = 'Activate: Discard 1 ' + Archetype.WOODLANDS + ' card. Draw 1 card. ' +
      'Gain 2 ' + ElementType.WOOD + '.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON, CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 1}];

    this.canActivate = function(): boolean {
      return this.location === CardLocation.FIELD &&
        this.owner.hand.cards.some(card => card.archetype === Archetype.WOODLANDS);
    }
    this.onActivate = function(): void {
      SP.getCardHandler().drawCards(this.owner, 1);
      SP.getSearchHandler().discardCardsByArchetype(this.owner, CardLocation.HAND, Archetype.WOODLANDS, 1,
        null);
      SP.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 2});
    }
  }
}

export class ElderwoodTreant extends Card {

  constructor() {
    super();

    this.setAttack(15);
    this.setHealth(25);

    this.name = 'Elderwood Treant';
    this.description = 'Mill: Summon this card.\n\n Standby: Destroy 1 of your ' + Archetype.WOODLANDS + ' ' +
      '"Elderwood" cards. Activate: Destroy 1 enemy building.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON, CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 4},{type: ElementType.DAWN, amount: 4}];

    this.onMill = function(): void {
      SP.getCardHandler().setActiveSearchCardsAction(CardAction.SUMMON);
      SP.getGamestateHandler().setGamestateLocation(CardLocation.GRAVEYARD);
      SP.getSearchViewComponent().selectCard(this);
    }
    this.onStandbyPhase = function(): void {
      SP.getSearchHandler().destroyCardsByPlayerAndArchetypeAndName(this.owner, CardLocation.FIELD,
        Archetype.WOODLANDS, 'Elderwood', 1, null);
    }
    this.canActivate = function(): boolean {
      return this.location === CardLocation.FIELD && SP.getPlayerHandler().getEnemyBuildings().length >= 1;
    }
    this.onActivate = function(): void {
      SP.getSearchHandler().destroyCardsByPlayerAndType(SP.getPlayerHandler().getEnemyPlayer(), CardLocation.FIELD,
        CardType.BUILDING, 1, null);
    }
  }
}

export class WoodlandsHuntress extends Card {

  constructor() {
    super();

    this.setAttack(11);
    this.setHealth(7);

    this.name = 'Woodlands Huntress';
    this.description = 'Summon: Deal 4 damage to all enemy units.\n\n Kill: Deal 2 damage to all enemy units.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 2}, {type: ElementType.FIRE, amount: 1}];

    this.onSummon = function(): void {
      SP.getUnitHandler().damageAllEnemyUnits(this, 4);
    }
    this.onKill = function(): void {
      SP.getUnitHandler().damageAllEnemyUnits(this, 2);
    }
  }
}

export class WoodlandsScavenger extends Card {

  constructor() {
    super();

    this.setAttack(4);
    this.setHealth(9);

    this.name = 'Woodlands Scavenger';
    this.description = 'Summon: Add 1 ' + Archetype.WOODLANDS + ' unit to your Hand.\n\n Removed: Draw 1 card.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 2}];

    this.onSummon = function(): void {
      SP.getSearchHandler().drawCardsByArchetypeAndType(this.owner, CardLocation.DECK, Archetype.WOODLANDS,
        CardType.UNIT, 1, this);
    }
    this.onRemoveFromField = function(): void {
      SP.getCardHandler().drawCards(this.owner, 1);
    }
  }
}

export class WoodlandsElven extends Card {

  constructor() {
    super();

    this.setAttack(7);
    this.setHealth(3);

    this.name = 'Woodlands Elven';
    this.description = 'Kill: Draw 1 Card';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];

    this.onKill = function () {
      SP.getCardHandler().drawCards(this.owner, 1);
    }
  }
}

export class WoodlandsExile extends Card {

  constructor() {
    super();

    this.setAttack(7);
    this.setHealth(10);

    this.name = 'Woodlands Exile';
    this.description = 'Hand: If you control another ' + Archetype.WOODLANDS + ' unit, you can special summon ' +
      'this card from your hand.\n\n Activate: Destroy 1 of your cards. Add 1 ' +
      Archetype.WOODLANDS + ' spell from your deck to your hand. Increase this cards attack by 3.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON, CardAction.SPECIAL_SUMMON, CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 1}, {type: ElementType.FIRE, amount: 1}];

    this.canSpecialSummon = function(): boolean {
      return SP.getPlayerHandler().getUnits(this.owner).some(card => card.archetype === Archetype.WOODLANDS);
    }
    this.onActivate = function(): void {
      SP.getSearchHandler().drawCardsByArchetypeAndType(SP.getPlayerHandler().getCurrentPlayer(),
        CardLocation.DECK, Archetype.WOODLANDS, CardType.SPELL, 1, null);
      SP.getSearchHandler().destroyCardsByPlayer(SP.getPlayerHandler().getCurrentPlayer(), CardLocation.FIELD,
        1, null);
      SP.getUnitHandler().modifyUnitStats(this, 3, 0);
    }
  }
}

export class ThicketSpawn extends Card {

  constructor() {
    super();

    this.setAttack(14);
    this.setHealth(12);

    this.name = 'Thicket Spawn';
    this.description = 'Hand: You can special summon this card if you destroy 1 ' + Archetype.WOODLANDS + ' unit ' +
      'on your side of the field.\n\n Summon: Destroy 1 card on the field.\n\n' +
      'Discard: Gain 3 ' + ElementType.WOOD + '.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON, CardAction.SPECIAL_SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 3}, {type: ElementType.SHADOW, amount: 1}];

    this.canSpecialSummon = function(): boolean {
      return SP.getPlayerHandler().getUnits(this.owner).filter(
        card => card.archetype === Archetype.WOODLANDS).length >= 1;
    }
    this.onSpecialSummon = function(): void {
      this.onSummon();
      SP.getSearchHandler().destroyCardsByPlayerAndTypeAndArchetype(this.owner, CardLocation.FIELD, CardType.UNIT,
        Archetype.WOODLANDS, 1, this);
    }
    this.onSummon = function(): void {
      SP.getSearchHandler().destroyCards(this.owner, CardLocation.FIELD, 1, null);
    }
    this.onDiscard = function(): void {
      SP.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 3});
    }
  }
}

export class SummonedSaplings extends Card {

  constructor() {
    super();

    this.setAttack(1);
    this.setHealth(1);

    this.name = 'Summoned Saplings';
    this.description = 'Discard: Draw 1 card.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];

    this.onDiscard = function(): void {
      SP.getCardHandler().drawCards(this.owner, 1);
    }
  }
}

export class JungleWyrm extends Card {

  constructor() {
    super();

    this.setAttack(22);
    this.setHealth(23);

    this.name = 'Jungle Wyrm';
    this.description = 'Hand: You can special summon this card if you destroy 2 ' + Archetype.WOODLANDS + ' units ' +
      'on your side of the field.\n\n' +
      'Activate: Discard 1 ' + Archetype.WOODLANDS + ' unit. Destroy 1 card on the field.\n\n' +
      'Removed: Summon 1 ' + Archetype.WOODLANDS + ' unit with 15 or less health from your graveyard.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON, CardAction.SPECIAL_SUMMON, CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 5}, {type: ElementType.STORM, amount: 3}];

    this.canSpecialSummon = function(): boolean {
      return SP.getPlayerHandler().getUnits(this.owner).filter(
        card => card.archetype === Archetype.WOODLANDS).length >= 2;
    }
    this.onSpecialSummon = function(): void {
      SP.getSearchHandler().destroyCardsByPlayerAndTypeAndArchetype(this.owner, CardLocation.FIELD, CardType.UNIT,
        Archetype.WOODLANDS, 2, this);
    }
    this.canActivate = function(): boolean {
      return this.location === CardLocation.FIELD && this.owner.hand.cards.some(
        card => card.archetype === Archetype.WOODLANDS && card.type === CardType.UNIT);
    }
    this.onActivate = function(): void {
      SP.getSearchHandler().destroyCards(this.owner, CardLocation.FIELD, 1, null);
      SP.getSearchHandler().discardCardsByArchetypeAndType(this.owner, CardLocation.HAND, Archetype.WOODLANDS,
        CardType.UNIT, 1, null);
    }
    this.onRemoveFromField = function(): void {
      SP.getSearchHandler().summonCardsByArchetypeAndHealth(this.owner, CardLocation.GRAVEYARD, Archetype.WOODLANDS,
        15, 1, null);
    }
  }
}

export class Bioterror extends Card {

  constructor() {
    super();

    this.setAttack(13);
    this.setHealth(38);

    this.name = 'Bioterror';
    this.description = 'When this card would be destroyed, you can destroy one other ' + Archetype.WOODLANDS + ' unit instead.\n\n' +
      'Summon: Double your ' + ElementType.WOOD + '.\n\n' +
      'Activate: Pay 4 Wood. Add 1 ' + Archetype.WOODLANDS + ' unit from your graveyard to your hand.';

    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON, CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 8}, {type: ElementType.STORM, amount: 2},
      {type: ElementType.SHADOW, amount: 2}];

    this.canBeDestroyed = function(): boolean {
      if (SP.getPlayerHandler().getOtherUnits(this.owner, this).length >= 1) {
        SP.getSearchHandler().destroyCardsByPlayerAndTypeAndArchetype(this.owner, CardLocation.FIELD, CardType.UNIT,
          Archetype.WOODLANDS, 1, this);
        return false;
      }
      else {
        return true;
      }
    }
    this.onSummon = function(): void {
      SP.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount:
          SP.getPlayerHandler().getElementAmount(this.owner, ElementType.WOOD)});
    }
    this.canActivate = function(): boolean {
      return this.location === CardLocation.FIELD &&
        SP.getPlayerHandler().getElementAmount(this.owner, ElementType.WOOD) >= 4 && this.owner.graveyard.cards.some(
        card => card.archetype === Archetype.WOODLANDS && card.type === CardType.UNIT);
    }
    this.onActivate = function(): void {
      SP.getCardHandler().loseElement(this.owner, {type: ElementType.WOOD, amount: 4});
      SP.getSearchHandler().drawCardsByArchetypeAndType(this.owner, CardLocation.GRAVEYARD, Archetype.WOODLANDS,
        CardType.UNIT, 1, this);
    }
  }
}

export class GreenLair extends Card {

  constructor() {
    super();

    this.name = 'Green Lair';
    this.description = 'Add 1 "' + Archetype.WOODLANDS + '" card from your deck to your hand';
    this.type = CardType.SPELL;
    this.cardActions = [CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 1}];

    this.onActivate = function(): void {
      SP.getSearchHandler().drawCardsByName(this.owner, CardLocation.DECK, Archetype.WOODLANDS, 1, this);
    }
  }
}

export class Terraform extends Card {

  constructor() {
    super();

    this.name = 'Terraform';
    this.description = 'Add 1 ' + Archetype.WOODLANDS + ' ' + CardType.MONUMENT + ' card from your deck to your hand';
    this.type = CardType.SPELL;
    this.cardActions = [CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 1}];

    this.onActivate = function(): void {
      SP.getSearchHandler().drawCardsByArchetypeAndType(this.owner, CardLocation.DECK, Archetype.WOODLANDS,
        CardType.MONUMENT, 1, null);
    }
  }
}

export class ForestFire extends Card {

  constructor() {
    super();

    this.name = 'Forest Fire';
    this.description = 'Take 4 Damage. Gain 4 ' + ElementType.FIRE + '.';
    this.type = CardType.SPELL;
    this.cardActions = [CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 1}];

    this.canActivate = function(): boolean {
      return this.location === CardLocation.HAND && this.owner.remainingHealth > 4;
    }
    this.onActivate = function(): void {
      SP.getPlayerHandler().damagePlayer(this.owner, 4);
      SP.getCardHandler().gainElement(this.owner, {type: ElementType.FIRE, amount: 4});
    }
  }
}

export class Craftsmanship extends Card {

  constructor() {
    super();

    this.name = 'Craftsmanship';
    this.description = 'Discard 1 card. Place 1 ' + Archetype.WOODLANDS + ' building from your deck.';
    this.type = CardType.SPELL;
    this.cardActions = [CardAction.ACTIVATE];

    this.canActivate = function(): boolean {
      return this.location === CardLocation.HAND && SP.getPlayerHandler().getHandCards().length >= 1;
    }
    this.onActivate = function(): void {
      SP.getSearchHandler().placeCardsByArchetype(this.owner, CardLocation.DECK, Archetype.WOODLANDS, 1,
        null);
      SP.getSearchHandler().discardCards(SP.getPlayerHandler().getCurrentPlayer(), CardLocation.HAND, 1,
        null);
    }
  }
}

export class ANewBeginning extends Card {

  constructor() {
    super();

    this.name = 'A new Beginning';
    this.description = 'Destroy 1 of your ' + Archetype.WOODLANDS + ' cards. Take 3 damage. Draw 1 card. Gain 3 ' +
      ElementType.WOOD + '.';
    this.type = CardType.SPELL;
    this.cardActions = [CardAction.ACTIVATE];

    this.canActivate = function(): boolean {
      return this.location === CardLocation.HAND && SP.getPlayerHandler().getFieldCards().length >= 1 &&
        this.owner.remainingHealth > 3;
    }
    this.onActivate = function(): void {
      SP.getSearchHandler().destroyCardsByPlayerAndArchetype(
        SP.getPlayerHandler().getCurrentPlayer(), CardLocation.FIELD, Archetype.WOODLANDS, 1, null);
      SP.getPlayerHandler().damagePlayer(this.owner, 3);
      SP.getCardHandler().drawCards(SP.getPlayerHandler().getCurrentPlayer(), 1);
      SP.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 3});
    }
  }
}

export class TimeShiftingJungle extends Card {

  constructor() {
    super();

    this.name = 'Time Shifting Jungle';
    this.description = 'Gain 1 ' + ElementType.WOOD + ' and trigger the standby phase of all your ' +
      Archetype.WOODLANDS + ' buildings.';
    this.type = CardType.SPELL;
    this.cardActions = [CardAction.ACTIVATE];

    this.onActivate = function(): void {
      SP.getCardHandler().triggerStandbyPhaseForArchetypeAndType(this.owner, Archetype.WOODLANDS, CardType.BUILDING);
      SP.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 1});
    }
  }
}

export class PrimalWrath extends Card {

  constructor() {
    super();

    this.name = 'Primal Wrath';
    this.description = 'All ' + Archetype.WOODLANDS + ' units gain 5 attack and 3 health.';
    this.type = CardType.SPELL;
    this.cardActions = [CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 2}];

    this.canActivate = function (): boolean {
      return SP.getPlayerHandler().getUnits(this.owner)
        .some(unit => unit.archetype === Archetype.WOODLANDS) && this.location === CardLocation.HAND;
    }
    this.onActivate = function(): void {
      SP.getUnitHandler().modifyUnitsStatsByArchetype(this.owner, 5, 3, Archetype.WOODLANDS);
    }
  }
}

export class FleshToSoil extends Card {

  constructor() {
    super();

    this.name = 'Flesh To Soil';
    this.description = 'Destroy 1 enemy unit with health less than your ' + ElementType.WOOD + ' times 2.';
    this.type = CardType.SPELL;
    this.archetype = Archetype.NONE;
    this.cardActions = [CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.SHADOW, amount: 1}];

    this.canActivate = function (): boolean {
      return SP.getPlayerHandler().getEnemyUnits().some(unit => {
        return  SP.getPlayerHandler().getElementAmount(this.owner, ElementType.WOOD) * 2 > unit.remainingHealth;
      }) && this.location === CardLocation.HAND;
    }
    this.onActivate = function(): void {
      SP.getSearchHandler().destroyCardsByPlayerWoodAmount(SP.getPlayerHandler().getEnemyPlayer(), CardLocation.FIELD,
        SP.getPlayerHandler().getElementAmount(this.owner, ElementType.WOOD) * 2, 1, null);
      SP.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 2});
    }
  }
}

export class ShadowSurge extends Card {

  constructor() {
    super();

    this.name = 'Shadow Surge';
    this.description = 'Destroy 1 of your units. Gain ' + ElementType.WOOD + ' equal to its combined element cost';
    this.type = CardType.SPELL
    this.archetype = Archetype.NONE;
    this.cardActions = [CardAction.ACTIVATE];

    this.canActivate = function(): boolean {
      return this.location === CardLocation.HAND && SP.getPlayerHandler().getUnits(this.owner).length >= 1;
    }
    this.onActivate = function(): void {
      SP.getSearchHandler().destroyCardsByPlayerAndType(this.owner, CardLocation.FIELD, CardType.UNIT, 1,
        null);
      let amount: number = SP.getCardHandler()
        .getCombinedElementCosts(SP.getCardHandler().getSelectedSearchCards()![0]);
      SP.getCardHandler().gainElement(this.owner, {type: ElementType.SHADOW, amount: amount});
      //TODO
    }
  }
}

export class JungleRebornRitual extends Card {

  constructor() {
    super();

    this.name = 'Jungle Reborn Ritual';
    this.description = 'Summon 1 ' + Archetype.WOODLANDS + ' unit with 10 or less health from your graveyard.';
    this.type = CardType.SPELL;
    this.cardActions = [CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 2}];

    this.canActivate = function (): boolean {
      return this.location === CardLocation.HAND && this.owner.graveyard.cards.some(
        card => card.archetype === Archetype.WOODLANDS && card.type === CardType.UNIT && card.maxHealth <= 10);
    }
    this.onActivate = function(): void {
      SP.getSearchHandler().summonCardsByArchetypeAndHealth(this.owner, CardLocation.GRAVEYARD, Archetype.WOODLANDS,
        10, 1, null);
    }
  }
}

export class OpenWilderness extends Card {

  constructor() {
    super();

    this.name = 'Open Wilderness';
    this.description = ' Discard 1 ' + Archetype.WOODLANDS + ' card. Draw 3 cards.';
    this.type = CardType.SPELL;
    this.cardActions = [CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 1}, {type: ElementType.OCEAN, amount: 1}];

    this.canActivate = function(): boolean {
      return this.location === CardLocation.HAND &&
        this.owner.hand.cards.some(card => card.archetype === Archetype.WOODLANDS);
    }
    this.onActivate = function(): void {
      SP.getCardHandler().drawCards(this.owner, 3);
      SP.getSearchHandler().discardCardsByArchetype(this.owner, CardLocation.HAND, Archetype.WOODLANDS, 1,
        null);
    }
  }
}

export class RootGolem extends Card {

  constructor() {
    super();

    this.setAttack(7);
    this.setHealth(22);

    this.name = 'Root Golem';
    this.description = 'Combat: Takes half damage from being attacked.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 4}];

    this.defenseModifierOnBeingAttacked = function(): number {
      return 0.5;
    }
  }
}

export class BearBrute extends Card {

  constructor() {
    super();

    this.setAttack(15);
    this.setHealth(12);
    this.setAttacks(2);

    this.name = 'Bear Brute';
    this.description = 'Combat: Can attack 2 times.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 3}, {type: ElementType.FIRE, amount: 1}];
  }
}

export class TribeLeader extends Card {

  constructor() {
    super();

    this.setAttack(9);
    this.setHealth(8);

    this.name = 'Tribe Leader';
    this.description = 'Summon: All other ' + Archetype.WOODLANDS + ' units gain 4 attack and health.\n\n' +
      'Removed: Add 1 ' + Archetype.WOODLANDS + ' unit from your deck to your hand.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 2}, {type: ElementType.DAWN, amount: 1}];

    this.onSummon = function (): void {
      SP.getUnitHandler().modifyOtherUnitsStatsByArchetype(this.owner, 4, 4,
        Archetype.WOODLANDS, this);
    }
    this.onRemoveFromField = function (): void {
      SP.getSearchHandler().drawCardsByArchetypeAndType(this.owner, CardLocation.DECK, Archetype.WOODLANDS,
        CardType.UNIT, 1, this);
    }
  }
}

export class DawnDrake extends Card {

  constructor() {
    super();

    this.setAttack(16);
    this.setHealth(16);

    this.name = 'Dawn Drake';
    this.description = 'Standby: Gain 4 attack and health.\n\n Kill: Gain 4 Dawn.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 3}, {type: ElementType.STORM, amount: 1},
      {type: ElementType.DAWN, amount: 2}];

    this.onStandbyPhase = function (): void {
      SP.getUnitHandler().modifyUnitStats(this, 4, 4);
    }
    this.onKill = function (): void {
      SP.getCardHandler().gainElement(this.owner, {type: ElementType.DAWN, amount: 4});
    }
  }
}
