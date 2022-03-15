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

class ServiceProvider {

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
}

export class Card {

  owner: Player = null!;

  attack: number = 0;
  health: number = 0;

  maxUses: number = 1;
  remainingUses: number = 1;

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

  onStandby(): void {}
}

export class Sawmill extends Card {

  constructor() {
    super();

    this.name = 'Sawmill';
    this.description = 'Standby: Gains 1 Wood';
    this.type = CardType.BUILDING;
    this.cardActions = [CardAction.PLACE];
    this.imagePath = 'sawmill';

    this.onStandby = function() {
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
    this.onStandby = function() {
      ServiceProvider.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 2});
    }
  }
}

export class MagicalTreehouses extends Card {

  constructor() {
    super();

    this.attack = 8;
    this.health = 5;

    this.name = 'Magical Treehouses';
    this.description = 'Activate: Gain 1 Wood \n\n Standby: Draw 1 Card';
    this.type = CardType.BUILDING;
    this.cardActions = [CardAction.PLACE, CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 7}, {type: ElementType.DAWN, amount: 3}];
    this.imagePath = 'magical-treehouses';

    this.onActivate = function() {
      ServiceProvider.getCardHandler().gainElement(this.owner, {type: ElementType.WOOD, amount: 1});
    }
  }
}

export class Scout extends Card {

  constructor() {
    super();

    this.attack = 5;
    this.health = 7;

    this.name = 'Scout';
    this.description = 'Summon: Gains 1 Wood';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.SUMMON];
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
    this.health = 4;

    this.name = 'Spirit Wolf';
    this.description = 'Discard: Gains 2 Wood';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.SUMMON, CardAction.DISCARD];
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
    this.health = 28;

    this.name = 'Blighted Treant';
    this.description = 'Standby: Restore 7 health';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.SUMMON];
    this.elementCosts = [{type: ElementType.WOOD, amount: 5}, {type: ElementType.SHADOW, amount: 2}];
    this.imagePath = 'blighted-treant';

    this.onStandby = function() {
      //TODO
    }
  }
}

export class WoodlandHuntress extends Card {

  constructor() {
    super();

    this.attack = 11;
    this.health = 6;

    this.name = 'Woodland Huntress';
    this.description = 'Summon: Deal 3 damage to all enemy units';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.SUMMON, CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 3}, {type: ElementType.FIRE, amount: 1}];
    this.imagePath = 'woodland-huntress';

    this.onDiscard = function() {
      //TODO
    }
  }
}

export class JungleElf extends Card {

  constructor() {
    super();

    this.attack = 8;
    this.health = 5;

    this.name = 'Jungle Elf';
    this.description = 'Kill: Draw 1 Card';
    this.type = CardType.UNIT;
    this.cardActions = [CardAction.SUMMON, CardAction.ACTIVATE];
    this.elementCosts = [{type: ElementType.WOOD, amount: 2}, {type: ElementType.STORM, amount: 1}];
    this.imagePath = 'jungle-elf';

    this.onDiscard = function() {
      //TODO
    }
  }
}
