import {Element} from "./element";
import {Deck} from "./deck";
import {Hand} from "./hand";
import {Injectable} from "@angular/core";
import {Field} from "./field";

@Injectable()
export class Player {

  name: string = '';
  deck: Deck = new Deck();
  hand: Hand = new Hand();
  field: Field = new Field();
  elementals: Element[] = [];
}
