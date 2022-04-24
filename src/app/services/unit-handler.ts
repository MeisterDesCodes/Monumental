import {Injectable} from "@angular/core";
import {Card} from "../shared/card";
import {CardHandler} from "./card-handler";
import {PlayerHandler} from "./player-handler";

@Injectable()
export class UnitHandler {

  constructor(private cardHandler: CardHandler, private playerHandler: PlayerHandler) {
  }

  damageUnit(attacker: Card, defender: Card, amount: number) {
    defender.remainingHealth -= amount
    attacker.onKill();
    if (attacker.remainingHealth <= 0) {
      this.cardHandler.sendCardFromFieldToGraveyard(defender);
    }
  }

  damageAllUnits(card: Card, amount: number) {
    this.playerHandler.getEnemyUnits().forEach(unit => this.damageUnit(card, unit, amount));
  }

  healUnit(card: Card, amount: number): void {
    card.remainingHealth += amount - (amount - (card.maxHealth - card.remainingHealth));
  }
}
