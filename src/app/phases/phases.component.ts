import {Component} from '@angular/core';
import {GamephaseHandler} from "../services/gamephase-handler";
import {GamephaseType} from "../shared/gamephase-type";

@Component({
  selector: 'app-phases',
  templateUrl: './phases.component.html',
  styleUrls: ['./phases.component.css']
})
export class PhasesComponent {

  constructor(private gamephaseHandler: GamephaseHandler) { }

  enterCombatPhase() {
    this.gamephaseHandler.setGamephase(GamephaseType.COMBAT);
  }

  enterEndPhase() {
    this.gamephaseHandler.setGamephase(GamephaseType.END);
    this.gamephaseHandler.endTurn();
  }
}
