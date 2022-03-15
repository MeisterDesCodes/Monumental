import {Component, OnInit} from '@angular/core';
import {DeckHandler} from "../services/deck-handler";
import {Player} from "../shared/player";
import {PlayerHandler} from "../services/player-handler";
import {CardHandler} from "../services/card-handler";
import {ElementType} from "../shared/element-type";
import {GamephaseHandler} from "../services/gamephase-handler";

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
              private cardHandler: CardHandler, private gamephaseHandler: GamephaseHandler) { }

  ngOnInit() {
    this.cardHandler.gainElement(this.playerOne, {type: ElementType.WOOD, amount: 2});
    this.cardHandler.gainElement(this.playerOne, {type: ElementType.FIRE, amount: 3});
    this.gamephaseHandler.startTurn();
  }

  getCurrentPlayer(): Player {
    return this.playerHandler.getCurrentPlayer();
  }
}
