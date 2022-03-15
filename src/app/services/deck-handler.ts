import {Deck} from "../shared/deck";
import {Hand} from "../shared/hand";
import {CardHandler} from "./card-handler";
import {Player} from "../shared/player";
import {Injectable} from "@angular/core";
import {TestDeck} from "../../assets/decks/test-deck";
import * as _ from 'lodash';

@Injectable()
export class DeckHandler {

  deckSize: number = 20;
  initialHandSize: number = 4;

  constructor(private cardHandler: CardHandler, private testDeck: TestDeck) {
  }

  generateDeck(player: Player): Deck {
    let deck: Deck = _.cloneDeep(this.testDeck.deck);
    deck.cards.forEach(card => card.owner = player);
    this.shuffleDeck(deck);
    return deck;
  }

  generateHand(player: Player): Hand {
    this.cardHandler.drawCards(player, this.initialHandSize);
    return player.hand;
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
