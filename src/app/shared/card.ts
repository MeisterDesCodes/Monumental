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
import {GamestateType} from "./enums/gamestate-type";
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
    return this.location === CardLocation.HAND;
  }
  canSummon(): boolean {
    return true;
  }
  canPlace(): boolean {
    return true;
  }
  canDiscard(): boolean {
    return true;
  }

  onActivate(): void {}
  onDiscard(): void {}
  onSummon(): void {}
  onPlace(): void {}
  onMill(): void{}

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

  onWoodGain(): void {}

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
    this.imagePath = 'sawmill';

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
    this.imagePath = 'log-manufacturing-plant';

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
    this.imagePath = 'treetop-society';

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
    this.imagePath = 'lost-paradise';

    this.canActivate = function(): boolean {
      return this.location === CardLocation.FIELD &&
        SP.getPlayerHandler().getElementAmount(this.owner, ElementType.WOOD)! >= 2;
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
    this.imagePath = 'overgrown-temple';

    this.onPlace = function(): void {
      SP.getSearchHandler().drawCardsByArchetypeAndType(
        SP.getPlayerHandler().getCurrentPlayer(), CardLocation.DECK, Archetype.WOODLANDS, CardType.BUILDING,
        1, this);
    }
    this.onStandbyPhase = function(): void {
      if (this.location === CardLocation.FIELD) {
        SP.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 1});
        SP.getCardHandler().gainElement(this.owner, {type: ElementType.DAWN, amount: 1});
      }
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
    this.elementCosts = [{type: ElementType.WOOD, amount: 1},{type: ElementType.DAWN, amount: 1}];
    this.imagePath = 'spirit-tree';

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
    this.description = 'Place: Discard 1 card. Gain 2 ' + ElementType.DAWN + '\n\n' +
      'Standby: Gain 1 ' + ElementType.WOOD + ' and 1 ' + ElementType.DAWN + '.';
    this.type = CardType.BUILDING;
    this.cardActions = [CardAction.PLACE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 1}];
    this.imagePath = 'garden-of-hope';

    this.onPlace = function(): void {
      SP.getSearchHandler().discardCards(this.owner, CardLocation.HAND, 1, null);
      SP.getCardHandler().gainElement(this.owner, {type: ElementType.DAWN, amount: 2});
    }
    this.onStandbyPhase = function(): void {
      if (this.location === CardLocation.FIELD) {
        SP.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 1});
        SP.getCardHandler().gainElement(this.owner, {type: ElementType.DAWN, amount: 1});
      }
    }
  }
}

export class Wetlands extends Card {

  constructor() {
    super();

    this.name = 'Wetlands';
    this.description = 'Place: Discard 1 card.\n\n' +
      'Standby: Gain 1 ' + ElementType.WOOD + ' and 1 ' + ElementType.OCEAN + '.';
    this.type = CardType.BUILDING;
    this.cardActions = [CardAction.PLACE];
    this.imagePath = 'wetlands';

    this.onPlace = function(): void {
      SP.getSearchHandler().discardCards(this.owner, CardLocation.HAND, 1, null);
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
      '1 attack and health.';
    this.type = CardType.MONUMENT;
    this.cardActions = [CardAction.PLACE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 4}, {type: ElementType.OCEAN, amount: 2},
      {type: ElementType.DAWN, amount: 2}];
    this.imagePath = 'verdant-sanctuary';

    this.onWoodGain = function(): void {
      if (this.location === CardLocation.FIELD) {
        SP.getUnitHandler().modifyUnitsStatsByArchetype(1, 1, Archetype.WOODLANDS);
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
    this.elementCosts = [{type: ElementType.WOOD, amount: 8}, {type: ElementType.OCEAN, amount: 4}];
    this.imagePath = 'terraduct';

    this.canActivate = function(): boolean {
      return this.location === CardLocation.FIELD;
    }
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
    this.imagePath = 'storm-valley';

    this.onStandbyPhase = function(): void {
      if (this.location === CardLocation.FIELD) {
        SP.getSearchHandler().destroyCardsByPlayerAndType(this.owner, CardLocation.FIELD, CardType.BUILDING, 1,
          null);
        SP.getCardHandler().gainElement(this.owner, {type: ElementType.STORM, amount: 3});
      }
    }
  }
}

export class Scout extends Card {

  constructor() {
    super();

    this.setAttack(3);
    this.setHealth(5);

    this.name = 'Scout';
    this.description = 'Summon: Gain 1 ' + ElementType.WOOD + '.\n\n Removed: Gain ' + ElementType.WOOD + '.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.imagePath = 'scout';

    this.onSummon = function(): void {
      SP.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 1});
    }
    this.onRemoveFromField = function(): void {
      SP.getCardHandler().drawCards(this.owner, 1);
    }
  }
}

export class SpiritWolf extends Card {

  constructor() {
    super();

    this.setAttack(8);
    this.setHealth(5);

    this.name = 'Spirit Wolf';
    this.description = 'Discard: Gain 2 ' + ElementType.WOOD;
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON, CardAction.DISCARD];
    this.elementCosts = [{type: ElementType.WOOD, amount: 1}];
    this.imagePath = 'spirit-wolf';

    this.onDiscard = function(): void {
      SP.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 2});
    }
  }
}

export class SpiritCrow extends Card {

  constructor() {
    super();

    this.setAttack(3);
    this.setHealth(4);

    this.name = 'Spirit Crow';
    this.description = 'Summon: Add 2 "Spirit Crow" from your Graveyard to your hand.\n\n' +
      'Discard: Gain 2 ' + ElementType.SHADOW;
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON, CardAction.DISCARD];
    this.elementCosts = [{type: ElementType.STORM, amount: 1}, {type: ElementType.SHADOW, amount: 1}];
    this.imagePath = 'spirit-crow';

    this.onSummon = function(): void {
      SP.getSearchHandler().drawCardsByName(this.owner, CardLocation.GRAVEYARD, 'Spirit Crow', 2,
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
    this.imagePath = 'elderwood-dryad';

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
    this.imagePath = 'elderwood-stag';

    this.canDiscard = function (): boolean {
      return this.location === CardLocation.HAND && this.owner.hand.cards.some(
        card => card !== this && card.archetype === Archetype.WOODLANDS && card.type === CardType.UNIT);
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
    this.description = 'Discard: Gain 1 ' + ElementType.DAWN + ' and 1 ' + ElementType.OCEAN + '.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON, CardAction.DISCARD];
    this.imagePath = 'spirit-deer';

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
    this.imagePath = 'spirit-dragon';

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
    this.imagePath = 'blighted-treant';

    this.onStandbyPhase = function(): void {
      SP.getUnitHandler().healUnit(this, 7);
    }
  }
}

export class WoodlandsApexPredator extends Card {

  constructor() {
    super();

    this.setAttack(23);
    this.setHealth(12);

    this.name = 'Woodlands Apex Predator';
    this.description = 'Kill: Add 1 ' + Archetype.WOODLANDS + ' card from your deck to your hand.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 5}, {type: ElementType.SHADOW, amount: 2}];
    this.imagePath = 'woodlands-apex-predator';

    this.onKill = function(): void {
      SP.getSearchHandler().drawCardsByArchetype(this.owner, CardLocation.DECK, Archetype.WOODLANDS, 1,
        null);
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
    this.imagePath = 'elderwood-prophet';

    this.canActivate = function(): boolean {
      return this.location === CardLocation.FIELD && this.owner.hand.cards.length >= 1;
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
    this.imagePath = 'elderwood-treant';

    this.onMill = function(): void {
      SP.getCardHandler().setActiveSearchCardsAction(CardAction.SUMMON);
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
    this.description = 'Summon: Deal 4 damage to all enemy units.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 2}, {type: ElementType.FIRE, amount: 1}];
    this.imagePath = 'woodlands-huntress';

    this.onSummon = function(): void {
      SP.getUnitHandler().damageAllEnemyUnits(this, 4);
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
    this.imagePath = 'woodlands-scavenger';

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

    this.setAttack(6);
    this.setHealth(4);

    this.name = 'Woodlands Elven';
    this.description = 'Kill: Draw 1 Card';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.imagePath = 'woodlands-elven';

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
    this.description = 'Activate: Destroy 1 of your cards. Add 1 ' + Archetype.WOODLANDS + ' spell from your deck ' +
      'to your hand. Increase this cards attack by 3.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON, CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 1}, {type: ElementType.FIRE, amount: 1}];
    this.imagePath = 'woodlands-exile';

    this.canActivate = function(): boolean {
      return this.location === CardLocation.FIELD;
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

    this.setAttack(15);
    this.setHealth(10);

    this.name = 'Thicket Spawn';
    this.description = 'Summon: Destroy 1 card on the field.\n\n Discard: Gain 3 ' + ElementType.WOOD + '.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 5}, {type: ElementType.SHADOW, amount: 1}];
    this.imagePath = 'thicket-spawn';

    this.onSummon = function(): void {
      SP.getSearchHandler().destroyCards(SP.getPlayerHandler().getCurrentPlayer(), CardLocation.FIELD, 1,
        null);
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
    this.imagePath = 'summoned-saplings';

    this.onDiscard = function(): void {
      SP.getCardHandler().drawCards(this.owner, 1);
    }
  }
}

export class JungleWyrm extends Card {

  constructor() {
    super();

    this.setAttack(33);
    this.setHealth(29);

    this.name = 'Jungle Wyrm';
    this.description = 'Summon: Destroy 3 ' + Archetype.WOODLANDS + ' units on your side of the field.\n\n' +
      'Activate: Discard 1 card. Destroy 1 card on the field.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON, CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 7}, {type: ElementType.STORM, amount: 3}];
    this.imagePath = 'jungle-wyrm';

    this.canSummon = function(): boolean {
      return SP.getPlayerHandler().getUnits().length >= 3;
    }
    this.onSummon = function(): void {
      SP.getSearchHandler().destroyCardsByPlayerAndTypeAndArchetype(this.owner, CardLocation.FIELD, CardType.UNIT,
        Archetype.WOODLANDS, 3, this);
    }
    this.canActivate = function(): boolean {
      return this.location === CardLocation.FIELD && this.owner.hand.cards.length >= 1;
    }
    this.onActivate = function(): void {
      SP.getSearchHandler().destroyCards(SP.getPlayerHandler().getCurrentPlayer(), CardLocation.FIELD, 1,
        null);
      SP.getSearchHandler().discardCards(SP.getPlayerHandler().getCurrentPlayer(), CardLocation.HAND, 1,
        null);
    }
  }
}

export class GreenLair extends Card {

  constructor() {
    super();

    this.name = 'Green Lair';
    this.description = 'Add 1 ' + Archetype.WOODLANDS + ' card from your deck to your hand';
    this.type = CardType.SPELL;
    this.cardActions = [CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 1}];
    this.imagePath = 'green-lair';

    this.onActivate = function(): void {
      SP.getSearchHandler().drawCardsByArchetype(this.owner, CardLocation.DECK, Archetype.WOODLANDS, 1, this);
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
    this.imagePath = 'terraform';

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
    this.imagePath = 'forest-fire';

    this.canActivate = function(): boolean {
      return this.location === CardLocation.HAND && this.owner.remainingHealth > 4;
    }
    this.onActivate = function(): void {
      SP.getPlayerHandler().damagePlayer(this.owner, 4);
      SP.getCardHandler().loseElement(this.owner, {type: ElementType.WOOD, amount: 1});
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
    this.imagePath = 'craftsmanship';

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
    this.description = 'Destroy 1 of your ' + Archetype.WOODLANDS + ' cards. Take 3 damage. Draw 1 card. Gain 2 ' +
      ElementType.WOOD + '.';
    this.type = CardType.SPELL;
    this.cardActions = [CardAction.ACTIVATE];
    this.imagePath = 'a-new-beginning';

    this.canActivate = function(): boolean {
      return this.location === CardLocation.HAND && SP.getPlayerHandler().getFieldCards().length >= 1 &&
        this.owner.remainingHealth > 3;
    }
    this.onActivate = function(): void {
      SP.getSearchHandler().destroyCardsByPlayerAndArchetype(
        SP.getPlayerHandler().getCurrentPlayer(), CardLocation.FIELD, Archetype.WOODLANDS, 1, null);
      SP.getPlayerHandler().damagePlayer(this.owner, 3);
      SP.getCardHandler().drawCards(SP.getPlayerHandler().getCurrentPlayer(), 1);
      SP.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 2});
    }
  }
}

export class PrimalWrath extends Card {

  constructor() {
    super();

    this.name = 'Primal Wrath';
    this.description = 'All ' + Archetype.WOODLANDS + ' units gain 5 Attack and 3 health.';
    this.type = CardType.SPELL;
    this.cardActions = [CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 2}];
    this.imagePath = 'primal-wrath';

    this.canActivate = function (): boolean {
      return SP.getPlayerHandler().getUnits()
        .some(unit => unit.archetype === Archetype.WOODLANDS) && this.location === CardLocation.HAND;
    }
    this.onActivate = function(): void {
      SP.getUnitHandler().modifyUnitsStatsByArchetype(5, 3, Archetype.WOODLANDS);
    }
  }
}

export class FleshToSoil extends Card {

  constructor() {
    super();

    this.name = 'Flesh To Soil';
    this.description = 'Destroy 1 enemy unit with health less than your ' + ElementType.WOOD + '.';
    this.type = CardType.SPELL;
    this.archetype = Archetype.NONE;
    this.cardActions = [CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.SHADOW, amount: 1}];
    this.imagePath = 'flesh-to-soil';

    this.canActivate = function (): boolean {
      return SP.getPlayerHandler().getEnemyUnits().some(unit => {
        return  SP.getPlayerHandler().getElementAmount(this.owner, ElementType.WOOD) > unit.remainingHealth;
      }) && this.location === CardLocation.HAND;
    }
    this.onActivate = function(): void {
      SP.getSearchHandler().destroyCardsByPlayerWoodAmount(SP.getPlayerHandler().getEnemyPlayer(), CardLocation.FIELD,
        1, null);
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
    this.imagePath = 'shadow-surge';

    this.canActivate = function(): boolean {
      return this.location === CardLocation.HAND && SP.getPlayerHandler().getUnits().length >= 1;
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
    this.imagePath = 'jungle-reborn-ritual';

    this.canActivate = function (): boolean {
      return this.location === CardLocation.HAND && this.owner.graveyard.cards.some(
        card => card.archetype === Archetype.WOODLANDS && card.type === CardType.UNIT && card.maxHealth <= 10);
    }
    this.onActivate = function(): void {
      SP.getSearchHandler().summonCardsByArchetypeAndHealth(this.owner, CardLocation.GRAVEYARD, Archetype.WOODLANDS,
        15, 1, null);
    }
  }
}

export class OpenWilderness extends Card {

  constructor() {
    super();

    this.name = 'Open Wilderness';
    this.description = 'Draw 3 cards. Discard 1 card';
    this.type = CardType.SPELL;
    this.cardActions = [CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 3}];
    this.imagePath = 'open-wilderness';

    this.onActivate = function(): void {
      SP.getSearchHandler().discardCards(this.owner, CardLocation.HAND, 1, null);
      SP.getCardHandler().drawCards(this.owner, 3);
    }
  }
}

export class RootGolem extends Card {

  constructor() {
    super();

    this.setAttack(11);
    this.setHealth(18);

    this.name = 'Root Golem';
    this.description = 'Combat: Takes half damage from being attacked.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 5}];
    this.imagePath = 'root-golem';

    this.defenseModifierOnBeingAttacked = function(): number {
      return 0.5;
    }
  }
}

export class BearBrute extends Card {

  constructor() {
    super();

    this.setAttack(16);
    this.setHealth(13);
    this.setAttacks(2);

    this.name = 'Bear Brute';
    this.description = 'Combat: Can attack 2 times.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 4}, {type: ElementType.FIRE, amount: 1}];
    this.imagePath = 'bear-brute';
  }
}

export class TribeLeader extends Card {

  constructor() {
    super();

    this.setAttack(9);
    this.setHealth(8);

    this.name = 'Tribe Leader';
    this.description = 'Summon: All other ' + Archetype.WOODLANDS + ' units gain 3 attack and health.\n\n' +
      'Removed: Add 1 ' + Archetype.WOODLANDS + ' unit from your deck to your hand.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 2}, {type: ElementType.DAWN, amount: 1}];
    this.imagePath = 'tribe-leader';

    this.onSummon = function (): void {
      SP.getUnitHandler().modifyOtherUnitsStatsByArchetype(3, 3, Archetype.WOODLANDS, this);
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
    this.imagePath = 'dawn-drake';

    this.onStandbyPhase = function (): void {
      SP.getUnitHandler().modifyUnitStats(this, 4, 4);
    }
    this.onKill = function (): void {
      SP.getCardHandler().gainElement(this.owner, {type: ElementType.DAWN, amount: 4});
    }
  }
}
