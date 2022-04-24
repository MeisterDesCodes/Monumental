import {Component} from '@angular/core';
import {GamephaseHandler} from "../../services/gamephase-handler";
import {GamephaseType} from "../../shared/gamephase-type";
import {GamestateHandler} from "../../services/gamestate-handler";
import {GamestateType} from "../../shared/gamestate-type";
import {Player} from "../../shared/player";
import {PlayerHandler} from "../../services/player-handler";
import {CardHandler} from "../../services/card-handler";

@Component({
  selector: 'app-phases',
  templateUrl: './phases.component.html',
  styleUrls: ['./phases.component.css']
})
export class PhasesComponent {

  gamePhases: GamephaseType[] = Object.values(GamephaseType);

  constructor(private gamephaseHandler: GamephaseHandler, private gamestateHandler: GamestateHandler,
              private playerHandler: PlayerHandler, private cardHandler: CardHandler) { }

  enterCombatPhase() {
    if (!this.gamephaseHandler.isValidGamePhase([GamephaseType.COMBAT])) {
      this.gamestateHandler.setGamestate(GamestateType.NORMAL);
      this.gamephaseHandler.setGamephase(GamephaseType.COMBAT);
    }
  }

  enterEndPhase() {
    this.gamestateHandler.setGamestate(GamestateType.NORMAL);
    this.gamephaseHandler.setGamephase(GamephaseType.END);
    this.endTurn();
  }

  startTurn(): void {
    let currentPlayer: Player = this.playerHandler.getCurrentPlayer();
    this.cardHandler.resetCards(currentPlayer);
    this.gamephaseHandler.setGamephase(GamephaseType.DRAW);
    this.cardHandler.drawCards(currentPlayer, 1);
    this.gamephaseHandler.setGamephase(GamephaseType.STANDBY);
    this.cardHandler.triggerStandbyPhase(currentPlayer);
    this.gamephaseHandler.setGamephase(GamephaseType.MAIN);
    this.cardHandler.triggerMainPhase(currentPlayer);
  }

  endTurn(): void {
    this.playerHandler.switchPlayers();
    this.startTurn();
  }

  isCompletedPhase(gamephase: GamephaseType): boolean {
    switch (gamephase) {
      case GamephaseType.DRAW:
        return this.gamephaseHandler.isValidGamePhase([GamephaseType.STANDBY, GamephaseType.MAIN,
          GamephaseType.COMBAT, GamephaseType.END]);
      case GamephaseType.STANDBY:
        return this.gamephaseHandler.isValidGamePhase([GamephaseType.MAIN, GamephaseType.COMBAT,
          GamephaseType.END]);
      case GamephaseType.MAIN:
        return this.gamephaseHandler.isValidGamePhase([GamephaseType.COMBAT, GamephaseType.END]);
    }
    return false;
  }

  isCurrentPhase(gamephase: GamephaseType): boolean {
    return this.gamephaseHandler.isValidGamePhase([gamephase]);
  }

  isSelectablePhase(gamephase: GamephaseType): boolean {
    switch (gamephase) {
      case GamephaseType.COMBAT:
        return this.gamephaseHandler.isValidGamePhase([GamephaseType.MAIN]);
      case GamephaseType.END:
        return this.gamephaseHandler.isValidGamePhase([GamephaseType.MAIN, GamephaseType.COMBAT]);
    }
    return false;
  }
}
