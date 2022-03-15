import {DeckHandler} from "./deck-handler";
import {Player} from "../shared/player";
import {Injectable} from "@angular/core";

@Injectable()
export class PlayerHandler {

  currentPlayer: Player = new Player();
  players: Player[] = [];

  constructor(private deckBuilder: DeckHandler) {
  }

  generatePlayer(name: string): Player {
    let player = new Player();
    player.name = name;
    player.deck = this.deckBuilder.generateDeck(player);
    player.hand = this.deckBuilder.generateHand(player);
    if (name === 'Player 1') {
      this.setCurrentPlayer(player);
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
}
