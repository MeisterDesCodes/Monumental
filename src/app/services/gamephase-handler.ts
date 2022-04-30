import {GamephaseType} from "../shared/enums/gamephase-type";
import {PlayerHandler} from "./player-handler";
import {CardHandler} from "./card-handler";
import {Injectable} from "@angular/core";
import {Player} from "../shared/player";
import {GamestateType} from "../shared/enums/gamestate-type";

@Injectable()
export class GamephaseHandler {

  gamephase: GamephaseType = GamephaseType.DRAW;

  constructor() {
  }

  setGamephase(gamephaseType: GamephaseType): void {
    this.gamephase = gamephaseType;
  }

  getGamephase(): GamephaseType {
    return this.gamephase;
  }

  isValidGamePhase(gamephaseTypes: GamephaseType[]): boolean {
    let currentGamephase = this.getGamephase();
    return gamephaseTypes.some(gamephaseType => gamephaseType === currentGamephase);
  }
}
