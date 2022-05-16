import {GamestateType} from "../shared/enums/gamestate-type";
import {Injectable} from "@angular/core";
import {GamestateLocationType} from "../shared/enums/gamestate-location-type";
import {CardLocation} from "../shared/enums/card-location";

@Injectable()
export class GamestateHandler {

  gamestate: GamestateType = GamestateType.NORMAL;
  gamestateLocation: CardLocation = CardLocation.DECK;

  constructor() {
  }

  setGamestate(gamestateType: GamestateType): void {
    this.gamestate = gamestateType;
  }

  getGamestate(): GamestateType {
    return this.gamestate;
  }

  setGamestateLocation(cardLocation: CardLocation): void {
    this.gamestateLocation = cardLocation;
  }

  getGamestateLocation(): CardLocation {
    return this.gamestateLocation;
  }

  isValidGamestate(gamestateTypes: GamestateType[]): boolean {
    let currentGamestate = this.getGamestate();
    return gamestateTypes.some(gamestateType => gamestateType === currentGamestate);
  }

  isValidGamestateLocation(cardLocations: CardLocation[]): boolean {
    let currentGamestateLocation = this.getGamestateLocation();
    return cardLocations.some(cardLocation =>
      cardLocation === currentGamestateLocation);
  }
}
