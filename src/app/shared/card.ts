import {ElementType} from './element-type';
import {Element} from "./element";
import {CardAction} from "./card-action";
import {Player} from "./player";
import {CardType} from "./card-type";
import {PlayerHandler} from "../services/player-handler";
import {DeckHandler} from "../services/deck-handler";
import {CardHandler} from "../services/card-handler";
import {GamestateHandler} from "../services/gamestate-handler";
import {serviceInjector} from "../app.module";
import {Archetype} from "./archetype";
import {CardLocation} from "./card-location";
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

  onActivate(): void {}
  onDiscard(): void {}
  onSummon(): void {}
  onPlace(): void {}
  onAttack(): void {}
  onDirectAttack(): void {}
  onKill(): void {}

  onStandbyPhase(): void {}
  onMainPhase(): void {}

  setHealth(amount: number): void {
    this.maxHealth = amount;
    this.remainingHealth = amount
  }
}

export class Sawmill extends Card {

  constructor() {
    super();

    this.name = 'Sawmill';
    this.description = 'Standby: Gains 1 Wood';
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
    this.description = 'Place: Gains 3 Wood \n\n Standby: Gains 2 Wood';
    this.type = CardType.BUILDING;
    this.cardActions = [CardAction.PLACE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 6}];
    this.imagePath = 'wood-factory';

    this.onPlace = function() {
      ServiceProvider.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 3});
    }
    this.onStandbyPhase = function() {
      ServiceProvider.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 2});
    }
  }
}

export class MagicalTreehouses extends Card {

  constructor() {
    super();

    this.name = 'Magical Treehouses';
    this.description = 'Activate (Hand): Gain 1 Wood \n\n Standby (Field): Draw 1 Card';
    this.type = CardType.BUILDING;
    this.cardActions = [CardAction.PLACE, CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 7}, {type: ElementType.DAWN, amount: 3}];
    this.imagePath = 'magical-treehouses';

    this.onActivate = function() {
      if (this.location === CardLocation.HAND) {
        ServiceProvider.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 1});
      }
    }
    this.onStandbyPhase = function() {
      if (this.location === CardLocation.FIELD) {
        ServiceProvider.getCardHandler().drawCards(this.owner, 1);
      }
    }
  }
}

export class Scout extends Card {

  constructor() {
    super();

    this.attack = 5;
    this.setHealth(7);

    this.name = 'Scout';
    this.description = 'Summon: Gains 1 Wood';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 2}];
    this.imagePath = 'scout';

    this.onSummon = function() {
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
    this.description = 'Discard: Gains 2 Wood';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON, CardAction.DISCARD];
    this.elementCosts = [{type: ElementType.WOOD, amount: 1}];
    this.imagePath = 'spirit-wolf';

    this.onDiscard = function() {
      ServiceProvider.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 2});
    }
  }
}

export class BlightedTreant extends Card {

  constructor() {
    super();

    this.attack = 12;
    this.setHealth(22);

    this.name = 'Blighted Treant';
    this.description = 'Standby: Restore 6 health';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 5}, {type: ElementType.SHADOW, amount: 2}];
    this.imagePath = 'blighted-treant';

    this.onStandbyPhase = function() {
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
    this.description = 'Summon: Deal 3 damage to all enemy units';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 3}, {type: ElementType.FIRE, amount: 1}];
    this.imagePath = 'woodland-huntress';

    this.onSummon = function() {
      ServiceProvider.getUnitHandler().damageAllUnits(this, 3);
    }
  }
}

export class JungleElf extends Card {

  constructor() {
    super();

    this.attack = 8;
    this.setHealth(5);

    this.name = 'Jungle Elf';
    this.description = 'Kill: Draw 1 Card';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.ATTACK, CardAction.SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 2}, {type: ElementType.STORM, amount: 1}];
    this.imagePath = 'jungle-elf';

    this.onKill = function () {
      ServiceProvider.getCardHandler().drawCards(this.owner, 1);
    }
  }
}

  export class VerdantLair extends Card {

  constructor() {
    super();

    this.name = 'Verdant Lair';
    this.description = 'Add 1 ' + Archetype.WOODLANDS + ' card from your deck to your hand';
    this.type = CardType.SPELL;
    this.cardActions = [CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 4}];
    this.imagePath = 'verdant-lair';

    this.onActivate = function() {
      ServiceProvider.getSearchHandler().drawCardsByArchetype(this.owner, CardLocation.DECK, Archetype.WOODLANDS);
    }
  }
}
