import {Player} from "../shared/player";
import {Injectable} from "@angular/core";
import {CardType} from "../shared/enums/card-type";
import {Card} from "../shared/card";
import {Bowman, Warrior} from "../shared/hero";
import {Element} from "../shared/models/element";
import {ElementType} from "../shared/enums/element-type";

@Injectable()
export class PlayerHandler {

  currentPlayer: Player = new Player();
  players: Player[] = [];

  constructor() {
  }

  generatePlayer(name: string): Player {
    let player = new Player();
    player.name = name;
    if (name === 'Player 1') {
      player.hero = new Warrior();
      this.setCurrentPlayer(player);
    }
    else {
      player.hero = new Bowman();
    }
    this.players.push(player);
    return player;
  }

  setCurrentPlayer(player: Player): void {
    this.currentPlayer = player;
  }

  getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  getPlayers(): Player[] {
    return this.players;
  }

  switchPlayers() {
    this.currentPlayer = this.currentPlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  getElement(player: Player, elementType: ElementType): Element {
    return player.elementals.find(element => element.type === elementType)!;
  }

  getUnits(): Card[] {
    return this.currentPlayer.field.cards.filter(card => card.type === CardType.UNIT);
  }

  getOtherUnits(cardToExclude: Card): Card[] {
    return this.currentPlayer.field.cards.filter(card => card.type === CardType.UNIT && card !== cardToExclude);
  }

  getEnemyPlayer(): Player {
    return this.currentPlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  getEnemyUnits(): Card[] {
    return this.getEnemyPlayer().field.cards.filter(card => card.type === CardType.UNIT);
  }

  damagePlayer(player: Player, amount: number): void {
    player.remainingHealth -= amount;
    if (player.remainingHealth <= 0) {
      //TODO
    }
  }
}
