import {Element} from "./element";
import {Deck} from "./deck";
import {Hand} from "./hand";
import {Injectable} from "@angular/core";
import {Field} from "./field";
import {Graveyard} from "./graveyard";
import {Hero} from "./hero";

@Injectable()
export class Player {

  name: string = '';
  hero: Hero = new Hero();
  maxHealth: number = 20;
  remainingHealth = this.maxHealth;
  elementals: Element[] = [];

  deck: Deck = new Deck();
  hand: Hand = new Hand();
  field: Field = new Field();
  graveyard: Graveyard = new Graveyard();
}
