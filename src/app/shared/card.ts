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

export class ServiceProvider {

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
}

export class Card {

  owner: Player = null!;

  location: CardLocation = CardLocation.DECK;
  slot: CardSlotComponent | null = null;

  attack: number = 0;
  maxHealth: number = 0;
  remainingHealth: number = this.maxHealth;

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

  canPayActivationCosts(): boolean {
    return true;
  }

  onActivate(): void {}
  onDiscard(): void {}
  onSummon(): void {}
  onPlace(): void {}

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

  setHealth(amount: number): void {
    this.maxHealth = amount;
    this.remainingHealth = amount
  }

  setAttacks(amount: number): void {
    this.maxAttacks = amount;
    this.remainingAttacks = amount
  }
}

export class Sawmill extends Card {

  constructor() {
    super();

    this.name = 'Sawmill';
    this.description = 'Standby: Gain 1 ' + ElementType.WOOD;
    this.type = CardType.BUILDING;
    this.cardActions = [CardAction.PLACE];
    this.imagePath = 'sawmill';

    this.onStandbyPhase = function() {
      ServiceProvider.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 1});
    }
  }
}

export class WoodFactory extends Card {

  constructor() {
    super();

    this.name = 'Wood Factory';
    this.description = 'Place: Gain 2 ' + ElementType.WOOD + '\n\n Standby: Gains 2 ' + ElementType.WOOD + '.';
    this.type = CardType.BUILDING;
    this.cardActions = [CardAction.PLACE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 4}];
    this.imagePath = 'wood-factory';

    this.onPlace = function() {
      ServiceProvider.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 3});
    }
    this.onStandbyPhase = function() {
      ServiceProvider.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 2});
    }
  }
}

export class TreetopSociety extends Card {

  constructor() {
    super();

    this.name = 'Treetop Society';
    this.description = 'Activate (Hand): Gain 1 ' + ElementType.WOOD + '\n\n Standby (Field): Draw 1 Card';
    this.type = CardType.BUILDING;
    this.cardActions = [CardAction.PLACE, CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 7}, {type: ElementType.DAWN, amount: 3}];
    this.imagePath = 'treetop-society';

    this.onActivate = function(): void {
      if (this.location === CardLocation.HAND) {
        ServiceProvider.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 1});
      }
    }
    this.onStandbyPhase = function(): void {
      if (this.location === CardLocation.FIELD) {
        ServiceProvider.getCardHandler().drawCards(this.owner, 1);
      }
    }
  }
}

export class OvergrownTemple extends Card {

  constructor() {
    super();

    this.name = 'Overgrown Temple';
    this.description = 'Place: Add 1 ' + Archetype.WOODLANDS + ' Building to your hand.\n\n' +
      'Standby: Gain 1 ' + ElementType.WOOD + ' and 1 ' + ElementType.OCEAN + '.';
    this.type = CardType.BUILDING;
    this.cardActions = [CardAction.PLACE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 6}, {type: ElementType.OCEAN, amount: 2}];
    this.imagePath = 'overgrown-temple';

    this.onPlace = function(): void {
      ServiceProvider.getSearchHandler().drawCardsByArchetypeAndType(this.owner, CardLocation.DECK,
        Archetype.WOODLANDS, CardType.BUILDING);
    }
    this.onStandbyPhase = function(): void {
      if (this.location === CardLocation.FIELD) {
        ServiceProvider.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 1});
        ServiceProvider.getCardHandler().gainElement(this.owner, {type: ElementType.OCEAN, amount: 1});
      }
    }
  }
}

export class Wetlands extends Card {

  constructor() {
    super();

    this.name = 'Wetlands';
    this.description = 'Place: Discard one card.\n\n' +
      'Standby: Gain 1 ' + ElementType.WOOD + ' and 1 ' + ElementType.OCEAN + '.';
    this.type = CardType.BUILDING;
    this.cardActions = [CardAction.PLACE];
    this.imagePath = 'overgrown-temple';

    this.onPlace = function(): void {
      //TODO
    }
    this.onStandbyPhase = function(): void {
      if (this.location === CardLocation.FIELD) {
        ServiceProvider.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 1});
        ServiceProvider.getCardHandler().gainElement(this.owner, {type: ElementType.OCEAN, amount: 1});
      }
    }
  }
}

export class StormValley extends Card {

  constructor() {
    super();

    this.name = 'Storm Valley';
    this.description = 'Standby: Destroy one of your Buildings. Gain 2 ' + ElementType.STORM + '.';
    this.type = CardType.BUILDING;
    this.archetype = Archetype.NONE;
    this.cardActions = [CardAction.PLACE];
    this.imagePath = 'storm-valley';

    this.onStandbyPhase = function(): void {
      if (this.location === CardLocation.FIELD) {
        ServiceProvider.getCardHandler().gainElement(this.owner, {type: ElementType.STORM, amount: 2});
        //TODO
      }
    }
  }
}

export class Scout extends Card {

  constructor() {
    super();

    this.attack = 3;
    this.setHealth(5);

    this.name = 'Scout';
    this.description = 'Summon: Gain 1 ' + ElementType.WOOD;
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.imagePath = 'scout';

    this.onSummon = function(): void {
      ServiceProvider.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 1});
    }
  }
}

export class SpiritWolf extends Card {

  constructor() {
    super();

    this.attack = 7;
    this.setHealth(4);

    this.name = 'Spirit Wolf';
    this.description = 'Discard: Gain 2 ' + ElementType.WOOD;
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON, CardAction.DISCARD];
    this.elementCosts = [{type: ElementType.WOOD, amount: 1}];
    this.imagePath = 'spirit-wolf';

    this.onDiscard = function(): void {
      ServiceProvider.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 2});
    }
  }
}

export class BlightedTreant extends Card {

  constructor() {
    super();

    this.attack = 8;
    this.setHealth(17);

    this.name = 'Blighted Treant';
    this.description = 'Standby: Restore 6 health';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 4}, {type: ElementType.SHADOW, amount: 2}];
    this.imagePath = 'blighted-treant';

    this.onStandbyPhase = function(): void {
      ServiceProvider.getUnitHandler().healUnit(this, 6);
    }
  }
}

export class WoodlandHuntress extends Card {

  constructor() {
    super();

    this.attack = 9;
    this.setHealth(8);

    this.name = 'Woodland Huntress';
    this.description = 'Summon: Deal 4 damage to all enemy units';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 3}, {type: ElementType.FIRE, amount: 1}];
    this.imagePath = 'woodland-huntress';

    this.onSummon = function(): void {
      ServiceProvider.getUnitHandler().damageAllEnemyUnits(this, 3);
    }
  }
}

export class JungleElf extends Card {

  constructor() {
    super();

    this.attack = 6;
    this.setHealth(4);

    this.name = 'Jungle Elf';
    this.description = 'Kill: Draw 1 Card';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 2}];
    this.imagePath = 'jungle-elf';

    this.onKill = function () {
      ServiceProvider.getCardHandler().drawCards(this.owner, 1);
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
    this.elementCosts = [{type: ElementType.WOOD, amount: 2}];
    this.imagePath = 'green-lair';

    this.onActivate = function(): void {
      ServiceProvider.getSearchHandler().drawCardsByArchetype(this.owner, CardLocation.DECK, Archetype.WOODLANDS);
    }
  }
}

export class ForestFire extends Card {

  constructor() {
    super();

    this.name = 'Forest Fire';
    this.description = 'Take 4 Damage. Gain 3 ' + ElementType.WOOD;
    this.type = CardType.SPELL;
    this.cardActions = [CardAction.ACTIVATE];
    this.imagePath = 'forest-fire';

    this.onActivate = function(): void {
      ServiceProvider.getPlayerHandler().damagePlayer(this.owner, 4);
      ServiceProvider.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 3});
    }
  }
}

export class PrimalWrath extends Card {

  constructor() {
    super();

    this.name = 'Primal Wrath';
    this.description = 'All ' + Archetype.WOODLANDS + ' units gain 5 Attack and 4 maximum health';
    this.type = CardType.SPELL;
    this.cardActions = [CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 2}];
    this.imagePath = 'primal-wrath';

    this.canActivate = function (): boolean {
      return ServiceProvider.getPlayerHandler().getUnits()
        .some(unit => unit.archetype === Archetype.WOODLANDS) && this.location === CardLocation.HAND;
    }

    this.onActivate = function(): void {
      ServiceProvider.getPlayerHandler().getUnits().forEach(unit => {
        if (unit.archetype === Archetype.WOODLANDS) {
          unit.attack += 5;
          unit.maxHealth += 4;
          unit.remainingHealth += 4;
        }
      });
    }
  }
}

export class RootGolem extends Card {

  constructor() {
    super();

    this.attack = 14;
    this.setHealth(20);

    this.name = 'Root Golem';
    this.description = 'Takes half damage from being attacked';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 7}];
    this.imagePath = 'root-golem';

    this.defenseModifierOnBeingAttacked = function(): number {
      return 0.5;
    }
  }
}

export class BearBrute extends Card {

  constructor() {
    super();

    this.attack = 15;
    this.setHealth(16);
    this.setAttacks(2);

    this.name = 'Bear Brute';
    this.description = 'May attack 2 Times';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 4}];
    this.imagePath = 'bear-brute';
  }
}

export class TribeLeader extends Card {

  constructor() {
    super();

    this.attack = 9;
    this.setHealth(8);

    this.name = 'Tribe Leader';
    this.description = 'Summon: All other ' + Archetype.WOODLANDS + ' units gain 3 attack and health.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 3}, {type: ElementType.DAWN, amount: 1}];
    this.imagePath = 'tribe-leader';

    this.onSummon = function (): void {
      ServiceProvider.getPlayerHandler().getOtherUnits(this).forEach(unit => {
        if (unit.archetype === Archetype.WOODLANDS) {
          unit.attack += 3;
          unit.maxHealth += 3;
          unit.remainingHealth += 3;
        }
      });
    }
  }
}

export class LeafDrake extends Card {

  constructor() {
    super();

    this.attack = 16;
    this.setHealth(16);

    this.name = 'Leaf Drake';
    this.description = 'Standby: Gain 4 attack and health.';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 4}, {type: ElementType.DAWN, amount: 1},
      {type: ElementType.STORM, amount: 2}];
    this.imagePath = 'leaf-drake';

    this.onStandbyPhase = function (): void {
      this.attack += 4;
      this.maxHealth += 4;
      this.remainingHealth += 4;
    }
  }
}

export class FleshToSoil extends Card {

  constructor() {
    super();

    this.name = 'Flesh To Soil';
    this.description = 'Kill a unit with health less than your ' + Archetype.WOODLANDS +
      '. Gain 2 ' + Archetype.WOODLANDS + '.';
    this.type = CardType.SPELL;
    this.cardActions = [CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.SHADOW, amount: 2}];
    this.imagePath = 'flesh-to-soil';

    this.canActivate = function (): boolean {
      return ServiceProvider.getPlayerHandler().getEnemyUnits().some(unit => {
        let element: Element = ServiceProvider.getPlayerHandler().getElement(this.owner, ElementType.WOOD);
        return element && element.amount > unit.remainingHealth;
      }) && this.location === CardLocation.HAND;
    }

    this.onActivate = function(): void {
      //TODO
    }
  }
}

export class OpenWilderness extends Card {

  constructor() {
    super();

    this.name = 'Open Wilderness';
    this.description = 'Draw 2 Cards ';
    this.type = CardType.SPELL;
    this.cardActions = [CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 3}];
    this.imagePath = 'open-wilderness';

    this.onActivate = function(): void {
      ServiceProvider.getCardHandler().drawCards(this.owner, 2);
    }
  }
}
