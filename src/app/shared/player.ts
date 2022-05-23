import {Element} from "./models/element";
import {Deck} from "./models/deck";
import {Hand} from "./models/hand";
import {Injectable} from "@angular/core";
import {Field} from "./models/field";
import {Graveyard} from "./models/graveyard";
import {Hero} from "./hero";
import {WoodlandsDeck} from "../../assets/decks/woodlands-deck";
import {DeckTemplate} from "./models/deck-template";

@Injectable()
export class Player {

  name: string = '';
  hero: Hero = new Hero();
  maxHealth: number = 60;
  remainingHealth = this.maxHealth;
  elementals: Element[] = [];

  deckTemplate: DeckTemplate = new WoodlandsDeck();
  deck: Deck = new Deck();
  hand: Hand = new Hand();
  field: Field = new Field();
  graveyard: Graveyard = new Graveyard();
}
