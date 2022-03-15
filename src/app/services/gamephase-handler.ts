import {GamephaseType} from "../shared/gamephase-type";
import {PlayerHandler} from "./player-handler";
import {CardHandler} from "./card-handler";
import {Injectable} from "@angular/core";
import {Player} from "../shared/player";

@Injectable()
export class GamephaseHandler {

  gamephase: GamephaseType = GamephaseType.DRAW;

  constructor(private playerHandler: PlayerHandler, private cardHandler: CardHandler) {
  }

  setGamephase(gamephaseType: GamephaseType): void {
    this.gamephase = gamephaseType;
  }

  getGamephase(): GamephaseType {
    return this.gamephase;
  }

  startTurn(): void {
    let currentPlayer: Player = this.playerHandler.getCurrentPlayer();
    this.cardHandler.resetCards(currentPlayer);
    this.setGamephase(GamephaseType.DRAW);
    this.cardHandler.drawCards(currentPlayer, 1);
    this.setGamephase(GamephaseType.STANDBY);
    this.cardHandler.triggerStandbyPhase(currentPlayer);
  }

  endTurn(): void {
    this.playerHandler.switchPlayers();
    this.startTurn();
  }
}
