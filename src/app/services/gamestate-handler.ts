import {GamestateType} from "../shared/enums/gamestate-type";
import {Injectable} from "@angular/core";

@Injectable()
export class GamestateHandler {

  gamestate: GamestateType = GamestateType.NORMAL;

  constructor() {
  }

  setGamestate(gamestateType: GamestateType): void {
    this.gamestate = gamestateType;
  }

  getGamestate(): GamestateType {
    return this.gamestate;
  }

  isValidGamestate(gamestateTypes: GamestateType[]): boolean {
    let currentGamestate = this.getGamestate();
    return gamestateTypes.some(gamestateType => gamestateType === currentGamestate);
  }
}
