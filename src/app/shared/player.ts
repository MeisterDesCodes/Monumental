import {Element} from "./models/element";
import {Deck} from "./models/deck";
import {Hand} from "./models/hand";
import {Injectable} from "@angular/core";
import {Field} from "./models/field";
import {Graveyard} from "./models/graveyard";
import {Hero} from "./hero";

@Injectable()
export class Player {

  name: string = '';
  hero: Hero = new Hero();
  maxHealth: number = 60;
  remainingHealth = this.maxHealth;
  elementals: Element[] = [];

  deck: Deck = new Deck();
  hand: Hand = new Hand();
  field: Field = new Field();
  graveyard: Graveyard = new Graveyard();
}
