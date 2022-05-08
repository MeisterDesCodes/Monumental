import {GamephaseType} from "../shared/enums/gamephase-type";
import {Injectable} from "@angular/core";

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
