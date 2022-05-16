import {Deck} from "../shared/models/deck";
import {CardHandler} from "./card-handler";
import {Player} from "../shared/player";
import {Injectable} from "@angular/core";
import {TestDeck} from "../../assets/decks/test-deck";
import * as _ from 'lodash';
import {TestDeck2} from "../../assets/decks/test-deck-2";

@Injectable()
export class DeckHandler {

  deckSize: number = 20;
  initialHandSize: number = 4;

  constructor(private cardHandler: CardHandler, private testDeck: TestDeck, private testDeck2: TestDeck2) {
  }

  setupCards(player: Player): void {
    let deck: Deck = _.cloneDeep(this.testDeck2.deck);
    deck.cards.forEach(card => card.owner = player);
    this.shuffleDeck(deck);
    player.deck = deck;
    this.cardHandler.drawCards(player, this.initialHandSize);
    this.cardHandler.triggerChain();
  }

  shuffleDeck(deck: Deck) {
    for (let i = deck.cards.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * i);
      let temp = deck.cards[i];
      deck.cards[i] = deck.cards[j];
      deck.cards[j] = temp;
    }
  }
}
