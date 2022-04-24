import {Component, OnInit} from '@angular/core';
import {DeckHandler} from "../services/deck-handler";
import {Player} from "../shared/player";
import {PlayerHandler} from "../services/player-handler";
import {CardHandler} from "../services/card-handler";
import {ElementType} from "../shared/element-type";
import {GamephaseHandler} from "../services/gamephase-handler";
import {PhasesComponent} from "../player-panel/phases/phases.component";
import {GamestateHandler} from "../services/gamestate-handler";
import {GamestateType} from "../shared/gamestate-type";

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {

  playerOne: Player = this.playerHandler.generatePlayer('Player 1');
  playerTwo: Player = this.playerHandler.generatePlayer('Player 2');
  players: Player[] = this.playerHandler.getPlayers();

  constructor(private deckHandler: DeckHandler, private playerHandler: PlayerHandler,
              private cardHandler: CardHandler, private gamephaseHandler: GamephaseHandler,
              private phasesComponent: PhasesComponent, private gamestateHandler: GamestateHandler) { }

  ngOnInit() {
    this.cardHandler.gainElement(this.playerOne, {type: ElementType.WOOD, amount: 10});
    this.cardHandler.gainElement(this.playerOne, {type: ElementType.FIRE, amount: 10});
    this.cardHandler.gainElement(this.playerTwo, {type: ElementType.WOOD, amount: 10});
    this.cardHandler.gainElement(this.playerTwo, {type: ElementType.FIRE, amount: 10});
    this.deckHandler.setupCards(this.playerOne);
    this.deckHandler.setupCards(this.playerTwo);
    this.phasesComponent.startTurn();
  }

  getCurrentPlayer(): Player {
    return this.playerHandler.getCurrentPlayer();
  }

  isSearchState(): boolean {
    return this.gamestateHandler.isValidGamestate([GamestateType.SEARCH]);
  }
}
