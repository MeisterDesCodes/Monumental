import {Injectable} from "@angular/core";
import {Card} from "../shared/card";
import {CardHandler} from "./card-handler";
import {PlayerHandler} from "./player-handler";
import {Archetype} from "../shared/enums/archetype";

@Injectable()
export class UnitHandler {

  constructor(private cardHandler: CardHandler, private playerHandler: PlayerHandler) {
  }

  damageUnit(attacker: Card, defender: Card, amount: number) {
    defender.remainingHealth -= amount
    if (defender.remainingHealth <= 0) {
      attacker.onKill();
      this.cardHandler.sendCardFromFieldToGraveyard(defender);
    }
  }

  damageAllEnemyUnits(card: Card, amount: number) {
    this.playerHandler.getEnemyUnits().forEach(unit => this.damageUnit(card, unit, amount));
  }

  healUnit(card: Card, amount: number): void {
    card.remainingHealth += amount;
    if (card.remainingHealth > card.maxHealth) {
      card.remainingHealth = card.maxHealth;
    }
  }

  modifyUnitStats(card: Card, attackAmount: number, healthAmount: number): void {
    card.attack += attackAmount;
    card.maxHealth += healthAmount;
    card.remainingHealth += healthAmount;
  }

  modifyUnitsStatsByArchetype(attackAmount: number, healthAmount: number, archetype: Archetype): void {
    this.playerHandler.getUnits().forEach(unit => {
      if (unit.archetype === archetype) {
        unit.attack += attackAmount;
        unit.maxHealth += healthAmount;
        unit.remainingHealth += healthAmount;
      }
    });
  }

  modifyOtherUnitsStatsByArchetype(attackAmount: number, healthAmount: number, archetype: Archetype,
                                   cardToExclude: Card): void {
    this.playerHandler.getOtherUnits(cardToExclude).forEach(unit => {
      if (unit.archetype === archetype) {
        unit.attack += attackAmount;
        unit.maxHealth += healthAmount;
        unit.remainingHealth += healthAmount;
      }
    });
  }
}
